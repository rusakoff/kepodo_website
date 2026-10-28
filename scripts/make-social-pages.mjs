// Temporary 1200 × 630 social pages. Use the video's poster, never autoplay media.
// Serve locally, run this after building, then capture /_social/en.html and ru.html.
// The next build removes these pages from dist/.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { content } from '../src/content.mjs';
import { page } from '../src/page.mjs';
const dir=resolve(fileURLToPath(new URL('../dist/_social',import.meta.url)));
await mkdir(dir,{recursive:true});
for(const lang of ['en','ru']){
  const hero=page(content[lang]).match(/<section class="hero">[\s\S]*?<\/section>/)[0]
    .replace(/<video[\s\S]*?<\/video>/,`<img class="showreel-poster" src="/assets/videos/kepodo-showreel-${lang}.webp" width="1280" height="720" alt="">`);
  await writeFile(join(dir,lang+'.html'),`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>kepodo social preview</title><link rel="stylesheet" href="/styles.css"><style>
  *,*::before,*::after{animation:none!important;transition:none!important}body{position:relative;margin:0;width:1200px;height:630px;overflow:hidden;background:var(--pink)}.hero{height:630px}.hero-inner{width:1100px;padding:160px 0 0;display:grid;grid-template-columns:1fr 1.05fr;gap:30px;align-items:center}.hero-eyebrow{grid-column:1/-1;text-align:left;font-size:11px;margin:0}.hero-title-wrap{width:100%}.hero h1,html[lang=en] .hero h1{font-size:${lang==='ru'?54:78}px;line-height:1.05;text-align:left}.sticker{font-size:10px;padding:8px 14px}.sticker-left{left:0;top:33%}.sticker-right{right:22px;bottom:-32px}.hero-showreel{margin:0;width:100%;transform:rotate(-3deg)}.hero-showreel figcaption{font-size:10px}.hero-showreel figcaption>a,.hero-bottom,.showreel-play{display:none!important}.social-brand{position:absolute;top:42px;left:50px}.social-brand .brand-word{font-size:38px}.social-footer{position:absolute;left:50px;right:50px;bottom:35px;display:flex;justify-content:space-between;font-size:11px;font-weight:650;letter-spacing:.06em}
  </style></head><body><main>${hero}</main><div class="social-brand"><span class="brand-word">kepodo<span class="brand-dot">✳</span></span></div><div class="social-footer"><span>MARKDOWN + AI</span><span>${lang==='ru'?'ДЛЯ ТЕХ, КОМУ ИНТЕРЕСНО.':'MADE FOR CURIOUS MINDS.'}</span></div></body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
