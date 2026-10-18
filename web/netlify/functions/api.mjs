import { shippingFeeSatang, SHIPPING_POLICY_VERSION } from '../../shared/shipping.mjs';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { importBienvicaCatalog, isSellableProduct, presentProduct, discontinuedProductIds } from '../../shared/bienvica-catalog.mjs';
import { HttpError, requireValue, text, validateCheckout, quoteProducts, fingerprint, orderToken, validOrderToken, paymentAction } from '../../shared/commerce.mjs';

function services(){
  if(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON)throw new HttpError(503,'ยังไม่ได้เชื่อม Firebase');
  if(!getApps().length)initializeApp({credential:cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),storageBucket:process.env.FIREBASE_STORAGE_BUCKET});
  return{db:getFirestore(),auth:getAuth()};
}
function stripeClient(){if(!process.env.STRIPE_SECRET_KEY)throw new HttpError(503,'ยังไม่ได้เชื่อม Stripe');return new Stripe(process.env.STRIPE_SECRET_KEY);}
async function identity(req,required=false){const bearer=req.headers.get('authorization');if(!bearer){if(required)throw new HttpError(401,'กรุณาเข้าสู่ระบบ');return null;}try{return await services().auth.verifyIdToken(bearer.replace(/^Bearer /,''),true);}catch{throw new HttpError(401,'กรุณาเข้าสู่ระบบใหม่');}}
async function admin(req){const user=await identity(req,true);if(user.admin!==true)throw new HttpError(403,'เฉพาะผู้ดูแลเว็บไซต์');return user;}
function json(data,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
async function body(req){requireValue(req.headers.get('content-type')?.includes('application/json'),'ต้องเป็น JSON');const raw=await req.text();if(raw.length>50000)throw new HttpError(413,'ข้อมูลยาวเกินไป');try{return JSON.parse(raw)}catch{throw new HttpError(400,'JSON ไม่ถูกต้อง');}}
function docId(id){requireValue(/^[\w-]{1,100}$/.test(id||''));return id;}
function publicOrder(o){return{id:o.id,paymentStatus:o.paymentStatus,fulfillmentStatus:o.fulfillmentStatus,lines:o.lines,total:o.total,shippingFee:o.shippingFee,tracking:o.tracking||null,carrier:o.carrier||null,createdAt:o.createdAt};}
async function rateLimit(db,key,max=8){const ref=db.doc('limits/'+fingerprint(key));const minute=Math.floor(Date.now()/60000);await db.runTransaction(async t=>{const d=(await t.get(ref)).data();const n=d?.minute===minute?d.count:0;if(n>=max)throw new HttpError(429,'ลองอีกครั้งในอีกสักครู่');t.set(ref,{minute,count:n+1,expiresAt:new Date(Date.now()+3600000)});});}
function safeContent(input){const ids=['hero','story','bienvica','btime','xact'];const output={};for(const id of ids){const s=input?.[id];requireValue(s);const image=text(s.image||'',2000,false);requireValue(!image||image.startsWith('/assets/')||/^https:\/\/firebasestorage\.googleapis\.com\//.test(image),'รูปภาพต้องมาจากคลังของเว็บไซต์');output[id]={title:text(s.title,300),body:text(s.body,4000),button:text(s.button||'',100,false),image};}return output;}

async function checkout(req){
  if(process.env.CHECKOUT_ENABLED!=='true')throw new HttpError(503,'ยังไม่เปิดรับชำระเงิน กรุณาติดต่อทีม');
  const {db}=services();const stripe=stripeClient();const origin=new URL(process.env.SITE_URL||'').origin;
  requireValue(origin.startsWith('https://')||origin==='http://localhost:8888','ต้องตั้ง SITE_URL');
  const data=validateCheckout(await body(req)),user=await identity(req);const token=orderToken(data.checkoutId,process.env.ORDER_TOKEN_SECRET);
  await rateLimit(db,'checkout:'+(req.headers.get('x-nf-client-connection-ip')||req.headers.get('x-forwarded-for')||'unknown'),12);
  const orderRef=db.doc('orders/'+data.checkoutId),hash=fingerprint({items:data.items,shipping:data.shipping,uid:user?.uid||null});
  let order=await db.runTransaction(async t=>{
    const old=await t.get(orderRef);if(old.exists){const o=old.data();if(o.fingerprint!==hash)throw new HttpError(409,'คำขอสั่งซื้อเปลี่ยนไป กรุณาเริ่มใหม่');if(o.reservation!=='held'||o.paymentStatus!=='pending')throw new HttpError(409,'คำสั่งซื้อนี้ปิดแล้ว');return o;}
    const settings=(await t.get(db.doc('settings/shop'))).data();const refs=data.items.map(i=>db.doc('products/'+i.productId));const docs=await t.getAll(...refs);const quote=quoteProducts(data.items,docs.map(d=>({id:d.id,...d.data()})),shippingFeeSatang(settings));
    const o={id:data.checkoutId,uid:user?.uid||null,fingerprint:hash,...quote,shipping:data.shipping,paymentStatus:'pending',fulfillmentStatus:'unfulfilled',reservation:'held',checkoutExpiresAt:Math.floor(Date.now()/1000)+3600,createdAt:new Date().toISOString()};
    docs.forEach((d,i)=>t.update(d.ref,{stock:d.data().stock-data.items[i].quantity}));t.create(orderRef,o);return o;
  });
  if(order.stripeSessionId){const session=await stripe.checkout.sessions.retrieve(order.stripeSessionId);if(session.status==='open'&&session.url)return json({url:session.url,orderId:order.id,token});throw new HttpError(409,'คำสั่งซื้อกำลังตรวจสอบหรือหมดเวลา กรุณาดูสถานะคำสั่งซื้อ');}
  const line_items=order.lines.map(l=>({price_data:{currency:'thb',unit_amount:l.priceSatang,product_data:{name:l.name}},quantity:l.quantity}));
  if(order.shippingFee>0)line_items.push({price_data:{currency:'thb',unit_amount:order.shippingFee,product_data:{name:'ค่าจัดส่ง'}},quantity:1});
  // Stable key permits safe retries after a timeout without charging or reserving twice.
  const session=await stripe.checkout.sessions.create({mode:'payment',payment_method_types:['card','promptpay'],customer_email:order.shipping.email,line_items,metadata:{orderId:order.id},expires_at:order.checkoutExpiresAt,success_url:`${origin}/#/order/${order.id}?token=${token}`,cancel_url:`${origin}/#/order/${order.id}?token=${token}`},{idempotencyKey:'checkout:'+order.id});
  await orderRef.update({stripeSessionId:session.id});return json({url:session.url,orderId:order.id,token});
}

async function webhook(req){
  if(!process.env.STRIPE_WEBHOOK_SECRET)throw new HttpError(503,'Webhook is not configured');
  let event;try{event=stripeClient().webhooks.constructEvent(await req.text(),req.headers.get('stripe-signature'),process.env.STRIPE_WEBHOOK_SECRET)}catch{throw new HttpError(400,'Invalid webhook signature');}
  if(!['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.expired','checkout.session.async_payment_failed'].includes(event.type))return json({received:true});
  await applySession(event.data.object,event.type,event.id);return json({received:true});
}

async function applySession(session,type,eventId){
  const {db}=services(),id=docId(session.metadata?.orderId),orderRef=db.doc('orders/'+id),eventRef=db.doc('stripeEvents/'+eventId);
  await db.runTransaction(async t=>{
    const [seen,snapshot]=await t.getAll(eventRef,orderRef);if(seen.exists)return;if(!snapshot.exists)throw new Error('Order not found');const o=snapshot.data();if(o.stripeSessionId&&o.stripeSessionId!==session.id)throw new Error('Session mismatch');const action=paymentAction(o,session,type);
    if(action==='release'){const docs=await t.getAll(...o.lines.map(l=>db.doc('products/'+l.productId)));docs.forEach((d,i)=>{if(!d.exists)throw new Error('Product missing');t.update(d.ref,{stock:d.data().stock+o.lines[i].quantity})});t.update(orderRef,{paymentStatus:type.endsWith('expired')?'expired':'failed',reservation:'released'});}
    if(action==='paid')t.update(orderRef,{paymentStatus:'paid',reservation:'consumed',paidAt:new Date().toISOString(),stripeSessionId:session.id});
    t.create(eventRef,{orderId:id,type,action,createdAt:FieldValue.serverTimestamp()});
  });
}

// Recover dropped webhooks / interrupted checkout creation. Never treat the browser as proof of payment.
export async function reconcilePending(){
  if(process.env.CHECKOUT_ENABLED!=='true')return;
  const {db}=services(),stripe=stripeClient();const pending=await db.collection('orders').where('paymentStatus','==','pending').limit(100).get();
  for(const snap of pending.docs){
    const order=snap.data();let session;
    if(order.stripeSessionId)session=await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    else{
      const start=Math.floor(Date.parse(order.createdAt)/1000);
      for await(const candidate of stripe.checkout.sessions.list({created:{gte:start-5,lte:start+7200},limit:100})){
        if(candidate.metadata?.orderId===order.id){session=candidate;break;}
      }
      if(session)await snap.ref.update({stripeSessionId:session.id});
      // More than two hours old, no Stripe session exists in the creation window.
      else if(Date.now()-Date.parse(order.createdAt)>7200000){
        await applySession({id:'orphan-'+order.id,metadata:{orderId:order.id}},'checkout.session.expired','orphan-'+order.id);continue;
      }
    }
    if(session?.payment_status==='paid')await applySession(session,'checkout.session.async_payment_succeeded','reconcile-paid-'+session.id);
    else if(session?.status==='expired')await applySession(session,'checkout.session.expired','reconcile-expired-'+session.id);
  }
}

export default async function handler(req){
  try{
    const url=new URL(req.url);const path=url.pathname.replace(/^\/(?:\.netlify\/functions\/api|api)/,'').replace(/\/$/,'')||'/';
    if(path==='/stripe-webhook'&&req.method==='POST')return await webhook(req);
    if(path==='/checkout'&&req.method==='POST')return await checkout(req);
    const {db,auth}=services();
    if(path==='/bootstrap'&&req.method==='GET'){
      const [content,products,posts,polls,settings]=await Promise.all([db.doc('content/published').get(),db.collection('products').where('active','==',true).get(),db.collection('posts').where('status','==','published').limit(100).get(),db.collection('polls').where('active','==',true).limit(1).get(),db.doc('settings/shop').get()]);
      return json({shippingFeeSatang:shippingFeeSatang(settings.data()),content:content.exists?content.data().sections:null,products:products.docs.map(d=>({id:d.id,...d.data()})).filter(isSellableProduct).map(presentProduct),posts:posts.docs.map(d=>({id:d.id,...d.data()})),poll:polls.docs[0]?{id:polls.docs[0].id,...polls.docs[0].data()}:null});
    }
    const orderMatch=path.match(/^\/orders\/([\w-]+)$/);
    if(orderMatch&&req.method==='GET'){
      const snap=await db.doc('orders/'+docId(orderMatch[1])).get();if(!snap.exists)throw new HttpError(404,'ไม่พบคำสั่งซื้อ');const o=snap.data(),user=await identity(req);
      if(user?.admin!==true&&(!user||o.uid!==user.uid)&&!validOrderToken(o.id,url.searchParams.get('token'),process.env.ORDER_TOKEN_SECRET))throw new HttpError(403,'ไม่มีสิทธิ์ดูคำสั่งซื้อนี้');return json(publicOrder(o));
    }
    if(path==='/my-orders'&&req.method==='GET'){const u=await identity(req,true),s=await db.collection('orders').where('uid','==',u.uid).limit(100).get();return json(s.docs.map(d=>publicOrder(d.data())));}
    if(path==='/comments'&&req.method==='GET'){const postId=docId(url.searchParams.get('postId')),post=await db.doc('posts/'+postId).get();if(post.data()?.status!=='published')throw new HttpError(404,'ไม่พบโพสต์');const s=await db.collection('comments').where('postId','==',postId).get();return json(s.docs.filter(d=>d.data().status==='published').map(d=>({id:d.id,...d.data()})));}
    if(path==='/posts'&&req.method==='POST'){
      const u=await identity(req,true);await rateLimit(db,'posts:'+u.uid,3);const b=await body(req);const kind=text(b.kind,20);requireValue(['ask','review','ideas'].includes(kind));const brand=text(b.brand,30);requireValue(['all','Bienvica','B-time','Xactu-X'].includes(brand));const imagePath=text(b.imagePath||'',500,false);requireValue(!imagePath||imagePath.startsWith('submissions/'+u.uid+'/'));
      const ref=await db.collection('posts').add({title:text(b.title,200),body:text(b.body,4000),kind,brand,imagePath,authorUid:u.uid,authorName:text(u.name||'สมาชิก',100),status:'pending',createdAt:new Date().toISOString()});return json({id:ref.id,status:'pending'},201);
    }
    if(path==='/comments'&&req.method==='POST'){
      const u=await identity(req,true);await rateLimit(db,'comments:'+u.uid,6);const b=await body(req),postId=docId(b.postId);if((await db.doc('posts/'+postId).get()).data()?.status!=='published')throw new HttpError(404,'ไม่พบโพสต์');const r=await db.collection('comments').add({postId,body:text(b.body,2000),authorUid:u.uid,authorName:text(u.name||'สมาชิก',100),status:u.admin===true?'published':'pending',createdAt:new Date().toISOString()});return json({id:r.id,status:u.admin===true?'published':'pending'},201);
    }
    if(path==='/vote'&&req.method==='POST'){
      const u=await identity(req,true),b=await body(req),pollRef=db.doc('polls/'+docId(b.pollId)),voteRef=db.doc('votes/'+b.pollId+'_'+u.uid);await rateLimit(db,'votes:'+u.uid,10);
      await db.runTransaction(async t=>{const poll=(await t.get(pollRef)).data();requireValue(poll?.active===true&&poll.options.includes(b.option),'กิจกรรมไม่เปิดหรือคำตอบไม่ถูกต้อง');t.set(voteRef,{pollId:b.pollId,uid:u.uid,option:b.option,updatedAt:FieldValue.serverTimestamp()});});return json({success:true});
    }
    if(!path.startsWith('/admin/'))throw new HttpError(404,'ไม่พบรายการ');const u=await admin(req);
    if(path==='/admin/data'&&req.method==='GET'){
      const [draft,products,orders,posts,comments,settings]=await Promise.all([db.doc('content/draft').get(),db.collection('products').get(),db.collection('orders').orderBy('createdAt','desc').limit(100).get(),db.collection('posts').limit(200).get(),db.collection('comments').where('status','==','pending').limit(100).get(),db.doc('settings/shop').get()]);
      return json({draft:draft.data()?.sections||null,products:products.docs.map(d=>({id:d.id,...d.data()})).map(presentProduct),orders:orders.docs.map(d=>d.data()),posts:posts.docs.map(d=>({id:d.id,...d.data()})),comments:comments.docs.map(d=>({id:d.id,...d.data()})),settings:{...settings.data(),shippingFeeSatang:shippingFeeSatang(settings.data()),shippingPolicyVersion:SHIPPING_POLICY_VERSION}});
    }
    if(path==='/admin/content'&&req.method==='POST'){
      const b=await body(req),sections=safeContent(b.sections);const record={sections,updatedBy:u.uid,updatedAt:new Date().toISOString()};const batch=db.batch();batch.set(db.doc('content/draft'),record);if(b.publish===true)batch.set(db.doc('content/published'),record);await batch.commit();return json({success:true});
    }
    if(path==='/admin/product'&&req.method==='POST'){
      const b=await body(req);requireValue(!discontinuedProductIds.includes(b.id)||b.active!==true,'สินค้านี้เลิกจำหน่ายแล้ว');requireValue(['Bienvica','B-time','Xactu-X'].includes(b.brand));requireValue(b.priceSatang===null||Number.isSafeInteger(b.priceSatang)&&b.priceSatang>0);requireValue(b.stock===null||Number.isSafeInteger(b.stock)&&b.stock>=0);const image=text(b.image||'',2000,false);requireValue(!image||image.startsWith('/assets/')||/^https:\/\/firebasestorage\.googleapis\.com\//.test(image));
      const data={name:text(b.name,200),brand:b.brand,description:text(b.description||'',4000,false),instructions:text(b.instructions||'',2000,false),priceSatang:b.priceSatang,stock:b.stock,active:b.active===true,image};await db.doc('products/'+docId(b.id||randomUUID())).set(data,{merge:true});return json({success:true});
    }
    if(path==='/admin/import-bienvica'&&req.method==='POST'){
      return json({success:true,...await importBienvicaCatalog(db,u.uid)});
    }
    if(path==='/admin/settings'&&req.method==='POST'){const b=await body(req);requireValue(Number.isSafeInteger(b.shippingFeeSatang)&&b.shippingFeeSatang>=0);await db.doc('settings/shop').set({shippingFeeSatang:b.shippingFeeSatang,shippingPolicyVersion:SHIPPING_POLICY_VERSION},{merge:true});return json({success:true});}
    if(path==='/admin/shipping'&&req.method==='POST'){
      const b=await body(req),ref=db.doc('orders/'+docId(b.id));requireValue(['unfulfilled','processing','shipped','delivered'].includes(b.fulfillmentStatus));const tracking=text(b.tracking||'',100,false),carrier=text(b.carrier||'',100,false);if(['shipped','delivered'].includes(b.fulfillmentStatus))requireValue(tracking&&carrier,'กรุณาระบุขนส่งและเลขพัสดุ');await db.runTransaction(async t=>{const o=(await t.get(ref)).data();requireValue(o?.paymentStatus==='paid','คำสั่งซื้อยังไม่ชำระเงิน');t.update(ref,{fulfillmentStatus:b.fulfillmentStatus,tracking,carrier});});return json({success:true});
    }
    if(path==='/admin/moderate'&&req.method==='POST'){
      const b=await body(req);requireValue(['posts','comments'].includes(b.collection)&&['published','rejected'].includes(b.status));const ref=db.doc(b.collection+'/'+docId(b.id)),snap=await ref.get();if(!snap.exists)throw new HttpError(404,'ไม่พบโพสต์');let image=snap.data().image||'';
      if(b.collection==='posts'&&b.status==='published'&&snap.data().imagePath&&!image){const token=randomUUID(),path='public/community/'+snap.id;const bucket=getStorage().bucket();await bucket.file(snap.data().imagePath).copy(bucket.file(path));await bucket.file(path).setMetadata({metadata:{firebaseStorageDownloadTokens:token}});image=`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;}
      await ref.update({status:b.status,image,moderatedBy:u.uid});return json({success:true});
    }
    if(path==='/admin/post'&&req.method==='POST'){const b=await body(req);requireValue(['team','ask','review','ideas'].includes(b.kind));requireValue(['all','Bienvica','B-time','Xactu-X'].includes(b.brand));const id=docId(b.id||randomUUID());await db.doc('posts/'+id).set({title:text(b.title,200),body:text(b.body,6000),kind:b.kind,brand:b.brand,authorUid:u.uid,authorName:'ทีมจากสวนของเรา',status:b.publish?'published':'draft',createdAt:new Date().toISOString()},{merge:true});return json({success:true});}
    if(path==='/admin/poll'&&req.method==='POST'){const b=await body(req);requireValue(Array.isArray(b.options)&&b.options.length>=2&&b.options.length<=6);const options=b.options.map(o=>text(o,100));requireValue(new Set(options).size===options.length);const batch=db.batch(),old=await db.collection('polls').where('active','==',true).get();old.docs.forEach(d=>batch.update(d.ref,{active:false}));batch.set(db.collection('polls').doc(),{title:text(b.title,200),options,active:true});await batch.commit();return json({success:true});}
    if(path==='/admin/members'&&req.method==='GET'){const list=await auth.listUsers(100);return json(list.users.map(x=>({uid:x.uid,email:x.email,name:x.displayName||'',admin:x.customClaims?.admin===true,disabled:x.disabled})));}
    throw new HttpError(404,'ไม่พบรายการ');
  }catch(error){const status=error instanceof HttpError?error.status:500;if(status===500)console.error('API request failed:',error.message);return json({error:status===500?'ระบบขัดข้อง กรุณาลองใหม่':error.message},status);}
}
