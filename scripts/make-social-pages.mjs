// Run after building, then capture /_social/{en,ru}.html at 1200 × 630.
// These temporary pages are removed by the next build.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { content } from '../src/content.mjs';
import { escapeHtml as e, icon, brandMarkup, tabletMarkup } from '../src/page.mjs';
const dir = resolve(fileURLToPath(new URL('../dist/_social', import.meta.url)));
await mkdir(dir, { recursive: true });
for (const lang of ['en', 'ru']) {
  const c = content[lang];
  await writeFile(join(dir, lang + '.html'), `<!doctype html>
<html lang="${lang}" data-theme="dark"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>kepodo social preview</title><link rel="stylesheet" href="/styles.css"><style>
  body{position:relative;width:1200px;height:630px;overflow:hidden;background:#000}
  .social-brand{position:absolute;left:48px;top:32px}.social-brand .brand-logo{width:116px}
  .social-format{position:absolute;right:48px;top:36px;font-size:12px;color:#888}
  .social-copy{position:absolute;top:164px;left:48px;width:530px}.social-copy h1{font-size:48px;line-height:1.06;letter-spacing:-.03em}.social-copy h1 span{display:block}.social-copy p{font-size:16px;line-height:1.5;color:#a3a3a3;margin:24px 0 0;max-width:470px}.social-copy .button{min-height:44px;margin-top:28px;font-size:13px;padding:11px 18px}
  .social-preview{position:absolute;top:220px;left:610px;width:550px;padding:0 0 50px}.social-preview .tablet{--tablet-bezel:10px;--tablet-radius:24px}.social-preview .tablet-camera{width:4px}.social-preview::after{height:50px}.social-preview img{width:100%;height:auto}
  .social-float{position:absolute;width:60px;height:60px;display:grid;place-items:center;border:1px solid #222;border-radius:14px;background:#0c0c0c}.social-float img{width:32px;height:32px}.s1{top:120px;left:646px;transform:rotate(-11deg)}.s2{top:100px;right:92px;transform:rotate(7deg);width:58px;height:58px}.s3{top:126px;left:790px;transform:rotate(-8deg);width:54px;height:54px}.s4{top:111px;right:230px;transform:rotate(12deg)}
</style></head><body>
  <div class="brand social-brand">${brandMarkup()}</div><div class="social-format">${e(c.format)}</div>
  ${['claude','gemini','opencode','openai'].map((glyph,i)=>`<span class="social-float s${i+1}"><img class="provider-logo provider-${glyph}" src="/assets/providers/${glyph}.svg" width="38" height="38" alt=""></span>`).join('')}
  <div class="social-copy"><h1>${c.headline.map(line=>`<span>${e(line)}</span>`).join('')}</h1><p>${e(c.intro)}</p><span class="button">${icon('book')}${e(c.primary)}</span></div>
  <div class="social-preview tablet-scene">${tabletMarkup(`<img src="/assets/screenshots/${lang}-dark.webp" width="2720" height="1800" alt="${e(c.heroAlt)}">`)}</div>
</body></html>`);
}
console.log('Temporary social-preview pages written to dist/_social/');
