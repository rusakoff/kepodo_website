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
  await writeFile(join(dir,lang+'.html'),`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>kepodo social preview</title><style>@font-face{font-family:Manrope;font-weight:200 800;src:url('/assets/fonts/Manrope-Variable.ttf')}*{box-sizing:border-box}body{position:relative;isolation:isolate;margin:0;width:1200px;height:630px;overflow:hidden;background:#f0efec;color:#2d2d2d;font-family:Manrope,sans-serif;padding:58px 65px}.brand{width:145px;height:auto}.eyebrow{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;margin-top:65px;font-weight:600}h1{font-size:${lang==='ru'?72:68}px;line-height:1.08;letter-spacing:-4px;font-weight:550;margin:24px 0 25px}h1 span{color:#77776e}.description{font-size:17px;color:#605f58;line-height:1.8;max-width:410px}.art{position:absolute;inset:0;z-index:-1}.art img{position:absolute;width:90%;height:auto;right:0;top:14px;mask-image:linear-gradient(to right,transparent,#000 35%),linear-gradient(to bottom,transparent,#000 10%,#000 86%,transparent);mask-composite:intersect}.footer{position:absolute;bottom:35px;left:65px;right:65px;border-top:1px solid #d6d3cb;padding-top:18px;font-size:10px;color:#77766d;display:flex;justify-content:space-between}</style></head><body><div class="art"><img src="/assets/hero-collage.webp" alt=""></div><img class="brand" src="/assets/wordmark.png" alt="kepodo"><p class="eyebrow">${e(c.eyebrow)}</p><h1>${e(c.headline[0])}<br><span>${e(c.headline[1])}</span></h1><p class="description">${e(c.intro)}</p><div class="footer"><span>MARKDOWN + AI</span><span>EN / RU</span></div></body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
