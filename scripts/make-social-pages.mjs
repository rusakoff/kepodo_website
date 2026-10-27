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
  body{position:relative;margin:0;width:1200px;height:630px;overflow:hidden}.hero{height:630px;border:0}.hero-inner{width:1070px;min-height:630px;padding-block:120px 40px;grid-template-columns:1.05fr 1fr;gap:52px}.hero-copy{padding-bottom:0}.hero h1{font-size:${lang==='ru'?64:56}px}.hero-description{font-size:17px;max-width:400px}.hero-eyebrow{font-size:11px;margin-bottom:26px}.hero-actions,.hero-meta,.collage-caption{display:none}.hero-collage{width:94%}.collage-note p{font-size:25px}.social-brand{position:absolute;top:42px;left:65px;width:145px;height:auto}.social-footer{position:absolute;bottom:25px;left:65px;right:65px;border-top:1px solid #aeb1a34d;padding-top:13px;font-size:10px;letter-spacing:.06em;color:#626858;display:flex;justify-content:space-between}
  </style></head><body><main>${hero}</main><img class="social-brand" src="/assets/wordmark.png" alt="kepodo" width="145" height="40"><div class="social-footer"><span>MARKDOWN + AI</span><span>EN / RU</span></div></body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
