// Temporary static pages for capturing 1200 × 630 Open Graph artwork.
// Serve with `npm run preview`, run this, then capture /_social/en.html and ru.html.
// They are removed on the next build and are never part of the deployed site.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { content } from '../src/content.mjs';
import { escapeHtml as e } from '../src/page.mjs';
const dir=resolve(fileURLToPath(new URL('../dist/_social',import.meta.url)));
await mkdir(dir,{recursive:true});
for(const lang of ['en','ru']){
  const c=content[lang];
  await writeFile(join(dir,lang+'.html'),`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>kepodo social preview</title><style>@font-face{font-family:Manrope;font-weight:200 800;src:url('/assets/fonts/Manrope-Variable.ttf')}*{box-sizing:border-box}body{position:relative;margin:0;width:1200px;height:630px;overflow:hidden;background:#f0efec;color:#2d2d2d;font-family:Manrope,sans-serif;padding:62px 70px}.brand{width:150px;height:auto}.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:64px;font-weight:600}h1{font-size:${lang==='ru'?76:78}px;line-height:1.08;letter-spacing:-5px;font-weight:550;margin:23px 0 25px}h1 span{color:#85857e}.description{font-size:18px;color:#666660;line-height:1.7;max-width:580px}.squid{position:absolute;width:250px;height:auto;right:64px;top:200px;transform:rotate(-8deg)}.footer{position:absolute;bottom:41px;left:70px;right:70px;border-top:1px solid #d6d3cb;padding-top:18px;font-size:11px;color:#77766d;display:flex;justify-content:space-between}</style></head><body><img class="brand" src="/assets/wordmark.png" alt="kepodo"><p class="eyebrow">${e(c.eyebrow)}</p><h1>${e(c.headline[0])}<br><span>${e(c.headline[1])}</span></h1><p class="description">${e(c.intro)}</p><img class="squid" src="/assets/squid.webp" alt=""><div class="footer"><span>MARKDOWN + AI</span><span>EN / RU</span></div></body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
