// Temporary 1200 × 630 pages using the same hero markup and materials as the site.
// Serve with npm run preview, then run this and capture /_social/en.html and ru.html.
// The next build removes these pages from dist/.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { content } from '../src/content.mjs';
import { page } from '../src/page.mjs';
const dir=resolve(fileURLToPath(new URL('../dist/_social',import.meta.url)));
await mkdir(dir,{recursive:true});
for(const lang of ['en','ru']){
  const hero=page(content[lang]).match(/<section class="hero">[\s\S]*?<\/section>/)[0];
  await writeFile(join(dir,lang+'.html'),`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>kepodo social preview</title><link rel="stylesheet" href="/styles.css"><style>
  *,*::before,*::after{animation:none!important;transition:none!important}body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--pink)}.hero{height:630px}.hero-inner{width:1060px;padding:100px 0 0}.hero-eyebrow{font-size:10px;margin-bottom:24px}.hero h1,html[lang=en] .hero h1{font-size:${lang==='ru'?88:112}px;line-height:.98}.hero-scene{height:270px;width:850px;margin:22px auto 0}.companion-wrap{width:310px;top:-4px}.thought-paper{left:7%;top:22px;width:200px;padding:14px 18px 18px}.paper-bar{font-size:9px}.paper-lines{gap:7px;margin-top:16px}.thought-paper p{font-size:14px;margin-top:17px;width:150px}.insight-paper{right:6%;top:35px;width:190px;padding:20px}.insight-paper>p{font-size:18px;width:130px}.insight-spark{font-size:25px;right:9px;top:9px}.idea-map{margin-top:9px}.hero-bottom,.companion-caption,.scene-asterisk{display:none}.sticker{font-size:11px;padding:9px 18px}.swoop-left{left:-230px;top:-40px}.swoop-right{right:-230px;top:-40px}.social-brand{position:absolute;top:30px;left:0;right:0;text-align:center}.social-brand .brand-word{font-size:32px}.social-footer{position:absolute;left:50px;right:50px;bottom:20px;display:flex;justify-content:space-between;font-size:10px;font-weight:650;letter-spacing:.06em}
  </style></head><body><main>${hero}</main><div class="social-brand"><span class="brand-word">kepodo<span class="brand-dot">✳</span></span></div><div class="social-footer"><span>MARKDOWN + AI</span><span>${lang==='ru'?'ДЛЯ ТЕХ, КОМУ ИНТЕРЕСНО.':'MADE FOR CURIOUS MINDS.'}</span></div></body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
