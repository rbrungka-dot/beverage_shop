import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import './build.mjs';
const root=resolve('dist');
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=resolve(root,'.'+pathname);if(!p.startsWith(root+'/')&&p!==root){res.writeHead(403).end();return}let file;try{file=await readFile(p)}catch{file=await readFile(root+'/index.html')};res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.html':'text/html'})[extname(p)]||'text/html');res.end(file)}catch{res.writeHead(500).end()}}).listen(5173,'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:5173 — live APIs require netlify dev'));
