import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, extname, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=join(root,'dist');
const portFlag=process.argv.indexOf('--port');
const port=Number(process.env.PORT || (portFlag>=0?process.argv[portFlag+1]:4173));
const dev=process.argv.includes('--watch');
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid port');
const build=()=>execFileSync(process.execPath,[join(root,'scripts/build.mjs')],{cwd:root,stdio:'inherit'});
build();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
  try {
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    const url=new URL(req.url,'http://localhost');
    let pathname=decodeURIComponent(url.pathname);
    if(pathname.includes('\0')||pathname.includes('\\')){res.writeHead(400);res.end();return;}
    let file=resolve(dist,'.'+pathname);
    if(file!==dist&&!file.startsWith(dist+sep)){res.writeHead(403);res.end();return;}
    let status;
    try { status=await stat(file); } catch {}
    if(status?.isDirectory()){
      if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'+url.search});res.end();return;}
      file=join(file,'index.html');
    }
    let data;
    let code=200;
    try{data=await readFile(file);}catch{file=join(dist,'404.html');data=await readFile(file);code=404;}
    res.writeHead(code,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':dev?'no-store':'no-cache'});
    res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`kepodo website → http://localhost:${port} (EN) · http://localhost:${port}/ru/ (RU)`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
if(dev){
  let timer;
  for(const dir of ['src','public'])watch(join(root,dir),{recursive:true},()=>{
    clearTimeout(timer);timer=setTimeout(()=>{try{build();}catch(error){console.error('Build failed:',error.message);}},150);
  });
  console.log('Watching src/ and public/. Refresh the browser after edits.');
}
