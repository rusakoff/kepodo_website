import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from '../src/content.mjs';
import { page, escapeHtml } from '../src/page.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root,'dist');
let siteUrl = process.env.SITE_URL?.replace(/\/+$/,'') || '';
if(siteUrl) {
  const parsed = new URL(siteUrl);
  if(!['https:','http:'].includes(parsed.protocol) || parsed.search || parsed.hash || parsed.username || parsed.password) throw new Error('SITE_URL must be an http(s) URL without credentials, query, or hash.');
  siteUrl = parsed.origin + parsed.pathname.replace(/\/+$/,'');
}
const basePath = siteUrl ? new URL(siteUrl).pathname.replace(/\/$/,'') : '';
const local = path => escapeHtml(basePath + path);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(join(root,'public'),dist,{recursive:true});
await cp(join(root,'src/styles.css'),join(dist,'styles.css'));
await cp(join(root,'src/main.js'),join(dist,'main.js'));
for (const lang of ['en','ru']) {
  await mkdir(join(dist,lang),{recursive:true});
  await writeFile(join(dist,lang,'index.html'),page(content[lang],siteUrl));
}
await writeFile(join(dist,'index.html'),page(content.en,siteUrl));
await writeFile(join(dist,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — kepodo</title><link rel="stylesheet" href="${local('/styles.css')}"><main class="container section-pad"><p class="eyebrow">404 · kepodo</p><h1>Let's get back<br>to the text.</h1><p class="section-description">This page could not be found. / Эта страница не найдена.</p><p class="hero-actions"><a class="button" href="${local('/en/')}">English</a><a class="text-link" href="${local('/ru/')}">Русский</a></p></main></html>`);
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${siteUrl?'Sitemap: '+siteUrl+'/sitemap.xml\n':''}`);
if(siteUrl) await writeFile(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['en','ru'].map(lang=>`<url><loc>${escapeHtml(siteUrl)}/${lang}/</loc><xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(siteUrl)}/en/"/><xhtml:link rel="alternate" hreflang="ru" href="${escapeHtml(siteUrl)}/ru/"/></url>`).join('')}</urlset>`);
await writeFile(join(dist,'.nojekyll'),'');
console.log('Built English and Russian pages → dist/');
if(!siteUrl) console.log('Set SITE_URL to the full production URL when deploying to generate absolute social URLs and sitemap.xml.');
