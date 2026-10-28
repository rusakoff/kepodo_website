import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from '../src/content.mjs';
import { escapeHtml, page } from '../src/page.mjs';
const dist=resolve(fileURLToPath(new URL('../dist',import.meta.url)));
const siteUrl=process.env.SITE_URL?.replace(/\/+$/,'') || '';
const basePath=siteUrl ? new URL(siteUrl).pathname.replace(/\/$/,'') : '';
const outputPath=pathname=>{
  assert.ok(pathname.startsWith(basePath+'/'),`Path must be inside ${basePath || '/'}: ${pathname}`);
  const path=pathname.slice(basePath.length);
  return join(dist,path.endsWith('/')?path+'index.html':path);
};

for(const lang of ['en','ru']){
  test(`${lang}: localized static content, working anchors and available assets`,async()=>{
    const html=await readFile(join(dist,lang,'index.html'),'utf8');
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.ok(html.includes(`<title>${escapeHtml(content[lang].title)}</title>`));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size,'IDs must be unique');
    for(const [,target] of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(target),`Missing #${target}`);
    for(const [,target] of html.matchAll(/aria-controls="([^"]+)"/g))assert.ok(ids.includes(target),`Missing controlled element ${target}`);
    const assets=new Set([...html.matchAll(/(?:src|href|poster|data-lightbox)="(\/[^"#?]+)"/g)].map(m=>m[1]));
    for(const asset of assets){
      await access(outputPath(asset));
    }
    const ogPath=/property="og:image" content="([^"]+)"/.exec(html)[1];
    const og=await readFile(outputPath(new URL(ogPath,'https://test.invalid').pathname));
    assert.equal(og.readUInt32BE(16),1200);assert.equal(og.readUInt32BE(20),630);
    const screenshotPaths=[...html.matchAll(/(?:src|data-lightbox)="(\/[^"#]*assets\/screenshots\/[^"#]+)"/g)].map(m=>m[1]);
    assert.ok(screenshotPaths.length>=12);
    assert.ok(screenshotPaths.every(p=>p.includes('/'+lang+'-')),'Screenshot locale must match the page');
    for(const [,tag] of html.matchAll(/(<img\b[^>]+>)/g)){
      assert.match(tag,/\balt="[^"]*"/);
      assert.match(tag,/\bwidth="\d+"/);assert.match(tag,/\bheight="\d+"/);
    }
    assert.match(html,new RegExp(`/assets/videos/kepodo-showreel-${lang}\\.mp4`));
    assert.match(html,new RegExp(`poster="[^"]*/assets/videos/kepodo-showreel-${lang}\\.webp"`));
    assert.match(html,/<video\b[^>]*controls[^>]*playsinline[^>]*preload="none"/);
    assert.ok(!/href="(?:#|javascript:)["]/.test(html));
    assert.ok(!/\b(?:TODO|Lorem ipsum|undefined)\b/.test(html));
    assert.match(html,/hreflang="en"/);assert.match(html,/hreflang="ru"/);
    assert.equal((html.match(/<details name="faq">/g)||[]).length,6);
  });
}
test('both languages cover the same product features',()=>{
  for(const key of ['tabs','proof','extras'])assert.deepEqual(content.en[key].map(item=>item.id),content.ru[key].map(item=>item.id));
  assert.deepEqual(Object.keys(content.en),Object.keys(content.ru));
});
test('root is the English landing page, with a separate 404',async()=>{
  assert.equal(await readFile(join(dist,'index.html'),'utf8'),await readFile(join(dist,'en/index.html'),'utf8'));
  const notFound=await readFile(join(dist,'404.html'),'utf8');
  assert.match(notFound,/Page not found/);
  for(const [,path] of notFound.matchAll(/href="(\/[^"#]+)"/g))await access(outputPath(path));
});

test('GitHub Pages project URLs include the base path for every local resource',()=>{
  const url='https://test.invalid/kepodo_website';
  for(const lang of ['en','ru']){
    const html=page(content[lang],url);
    const paths=[...html.matchAll(/(?:href|src|poster|data-lightbox)="(\/[^"#]+)"/g)].map(m=>m[1]);
    assert.ok(paths.length>20);
    assert.ok(paths.every(path=>path.startsWith('/kepodo_website/')));
    assert.ok(html.includes(`rel="canonical" href="${url}/${lang}/"`));
    assert.ok(html.includes(`property="og:image" content="${url}/assets/og-${lang}.png"`));
  }
});

test('production metadata and CSS resources resolve under the site URL',async()=>{
  const css=await readFile(join(dist,'styles.css'),'utf8');
  for(const [,path] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)){
    const resolved=new URL(path,(siteUrl || 'https://test.invalid')+'/styles.css');
    await access(outputPath(resolved.pathname));
  }
  if(siteUrl){
    const sitemap=await readFile(join(dist,'sitemap.xml'),'utf8');
    for(const lang of ['en','ru']){
      assert.ok(sitemap.includes(`<loc>${escapeHtml(siteUrl)}/${lang}/</loc>`));
      const html=await readFile(join(dist,lang,'index.html'),'utf8');
      assert.ok(html.includes(`rel="canonical" href="${escapeHtml(siteUrl)}/${lang}/"`));
    }
    assert.ok((await readFile(join(dist,'robots.txt'),'utf8')).includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  }
});
