import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch, createReadStream } from 'node:fs';
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
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4'};
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
    // Stream media and honor byte ranges so seeking works in local previews, too.
    if(status?.isFile() && extname(file)==='.mp4') {
      const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':dev?'no-store':'no-cache'};
      let start=0, end=status.size-1, code=200;
      if(req.headers.range && req.method==='GET') {
        const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if(range && (range[1] || range[2])) {
          start=range[1]?Number(range[1]):Math.max(0,status.size-Number(range[2]));
          end=range[1]&&range[2]?Math.min(Number(range[2]),end):end;
        } else start=NaN;
        if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=status.size) {
          res.writeHead(416,{...headers,'Content-Range':`bytes */${status.size}`});res.end();return;
        }
        code=206;
        headers['Content-Range']=`bytes ${start}-${end}/${status.size}`;
      }
      res.writeHead(code,{...headers,'Content-Length':end-start+1});
      if(req.method==='HEAD'){res.end();return;}
      const stream=createReadStream(file,{start,end});
      stream.on('error',()=>res.destroy());
      res.on('close',()=>stream.destroy());
      stream.pipe(res);
      return;
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
