// Zero-dependency preview for the included production build.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.ico':'image/x-icon','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const base='/The-Loony-Bin-Lab';if(pathname===base||pathname.startsWith(base+'/'))pathname=pathname.slice(base.length)||'/';const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403);res.end();return}const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(body)}catch{res.writeHead(404);res.end('Not found')}});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'4173端口已在使用，请先关闭已有预览。':e.message);process.exitCode=1});
server.listen(4173,'127.0.0.1',()=>console.log('游戏已启动：http://127.0.0.1:4173\n按 Ctrl+C 停止。'));
