import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bienvicaCatalog,importBienvicaCatalog} from '../shared/bienvica-catalog.mjs';

function database(initial=[]){
 const records=new Map(initial);
 return {records,doc:path=>({path}),async runTransaction(callback){
  const writes=[];
  const result=await callback({
   getAll:async(...refs)=>refs.map(ref=>({exists:records.has(ref.path)})),
   create:(ref,value)=>writes.push([ref.path,value])
  });
  writes.forEach(([path,value])=>{assert(!records.has(path));records.set(path,value)});
  return result;
 }};
}
test('legacy import contains exactly the three approved sellable units and prices',async()=>{
 const db=database();const result=await importBienvicaCatalog(db,'admin-uid');
 assert.equal(result.created.length,3);assert.equal(db.records.size,3);
 assert.deepEqual(bienvicaCatalog.map(p=>p.priceSatang),[24000,240000,150000]);
 assert.deepEqual(bienvicaCatalog.map(p=>p.bottlesPerUnit),[1,12,6]);
 for(const product of db.records.values()){
  assert.equal(product.brand,'Bienvica');assert.equal(product.stock,100);
  assert.equal(product.importedBy,'admin-uid');assert.equal(product.stockSource,'temporary-manual');
 }
});
test('repeated import skips existing products and preserves changed price, stock and active status',async()=>{
 const path='products/'+bienvicaCatalog[0].id;
 const existing={stock:7,priceSatang:25000,active:false,name:'แก้ไขแล้ว'};
 const db=database([[path,existing]]);
 const first=await importBienvicaCatalog(db,'admin-uid');
 assert.equal(first.created.length,2);assert.deepEqual(first.skipped,[bienvicaCatalog[0].id]);
 const second=await importBienvicaCatalog(db,'admin-uid');
 assert.equal(second.created.length,0);assert.equal(second.skipped.length,3);
 assert.equal(db.records.get(path),existing);
});
