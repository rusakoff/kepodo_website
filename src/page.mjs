export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHtml;
const paths = {
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
  'align-left':'<path d="M4 6h16M4 12h12M4 18h8"/>',
  network:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  lightbulb:'<path d="M9 18h6m-5 3h4M9 15a6 6 0 1 1 6 0v1H9z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  monitor:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h5"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2m3 6a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2"/>',
  'file-diff':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h6m-3-3v6m-3 3h6"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-7L3 8m0-5v5h5m4-1v5l3 2"/>',
  sliders:'<path d="M4 7h8m4 0h4M4 17h3m4 0h9"/><circle cx="14" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  notebook:'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M5 7H2m3 5H2m3 5H2m8-9h5m-5 4h5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  moon:'<path d="M20.5 13a9 9 0 0 1-9.5-9.5A9 9 0 1 0 20.5 13Z"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  zoom:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6m-3-3v6"/>',
  x:'<path d="m6 6 12 12M6 18 18 6"/>',
  menu:'<path d="M4 7h16M4 17h16"/>',
  github:'<path d="M9 19c-5 1-5-2-7-2m14 5v-4a3 3 0 0 0-.9-2.3c3-.3 5.9-1.5 5.9-6.7a5.2 5.2 0 0 0-1.4-3.6 4.9 4.9 0 0 0-.1-3.6S18.4 1.5 15.8 3a13.2 13.2 0 0 0-7.6 0C5.6 1.5 4.5 1.8 4.5 1.8a4.9 4.9 0 0 0-.1 3.6A5.2 5.2 0 0 0 3 9c0 5.2 2.9 6.4 5.9 6.7A3 3 0 0 0 8 18v4"/>',
};
export const icon = (name,cls='') => `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`;
const repo='https://github.com/rusakoff/kepodo';
const ext='target="_blank" rel="noopener noreferrer"';
const providers=[['openai','ChatGPT'],['claude','Claude Code'],['openai','Codex'],['opencode','OpenCode'],['openrouter','OpenRouter'],['gemini','Gemini']];

export function page(c,siteUrl='') {
  const basePath = siteUrl ? new URL(siteUrl).pathname.replace(/\/$/,'') : '';
  const local = path => basePath + path;
  const asset = (lang,name) => local(`/assets/screenshots/${lang}-${name}.webp`);
  const screenshot=(shot,alt,cls='',priority=false)=>{
    const [width,height]=['connections','skills','settings'].includes(shot)?[1180,1800]:shot==='reading'?[1556,1700]:[2720,1800];
    return `<button class="screenshot ${cls}" type="button" data-lightbox="${asset(c.lang,shot)}" aria-label="${e(c.zoom)}: ${e(alt)}"><img src="${asset(c.lang,shot)}" alt="${e(alt)}" width="${width}" height="${height}" ${priority?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async"><span class="zoom-hint">${icon('zoom')}</span></button>`;
  };
  const localeHref=(lang)=>`/${lang}/`;
  const feature=(f,reverse=false)=>`<article class="feature-row ${reverse?'reverse':''}"><div class="feature-copy"><p class="eyebrow"><span class="chapter-number">${f.number}</span>${e(f.label)}</p><h3>${e(f.title).replace('\n','<br>')}</h3><p>${e(f.description)}</p><ul class="checklist">${f.points.map(s=>`<li>${icon('check')}<span>${e(s)}</span></li>`).join('')}</ul></div><figure class="feature-figure ${f.shot==='reading'?'reading-figure':'notes-figure'}">${screenshot(f.shot,f.alt)}<figcaption>${e(f.caption)}</figcaption></figure></article>`;
  return `<!doctype html>
<html lang="${c.lang}">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(c.title)}</title><meta name="description" content="${e(c.description)}">
  <meta name="theme-color" content="#f0efec"><meta name="color-scheme" content="light">
  <link rel="canonical" href="${e(siteUrl+localeHref(c.lang))}">
  <link rel="alternate" hreflang="en" href="${e(siteUrl+'/en/')}"><link rel="alternate" hreflang="ru" href="${e(siteUrl+'/ru/')}"><link rel="alternate" hreflang="x-default" href="${e(siteUrl+'/en/')}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="kepodo"><meta property="og:title" content="${e(c.title)}"><meta property="og:description" content="${e(c.description)}"><meta property="og:locale" content="${c.locale}">
  <meta property="og:image" content="${e(siteUrl+'/assets/og-'+c.lang+'.png')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(c.title)}">
  ${siteUrl?`<meta property="og:url" content="${e(siteUrl+localeHref(c.lang))}">`:''}<meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="${e(local('/favicon.png'))}"><link rel="preload" href="${e(local('/assets/fonts/Manrope-Variable.ttf'))}" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${e(local('/styles.css'))}"><script src="${e(local('/main.js'))}" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${e(c.skip)}</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="${e(local(localeHref(c.lang)))}" aria-label="kepodo"><img src="${e(local('/assets/wordmark.png'))}" width="121" height="33" alt="kepodo"></a>
  <nav class="desktop-nav" aria-label="${c.lang==='en'?'Main navigation':'Основная навигация'}">${c.nav.map((s,i)=>`<a href="#${['features','how-it-works','models'][i]}">${e(s)}</a>`).join('')}</nav>
  <div class="header-end"><div class="language-switch" aria-label="${c.lang==='en'?'Language':'Язык'}"><a href="${e(local(localeHref('en')))}" lang="en" hreflang="en" ${c.lang==='en'?'aria-current="page"':''}>EN</a><span aria-hidden="true">/</span><a href="${e(local(localeHref('ru')))}" lang="ru" hreflang="ru" ${c.lang==='ru'?'aria-current="page"':''}>RU</a></div><a class="button button-small header-cta" href="#get-started">${e(c.get)}${icon('arrow-up-right')}</a><button class="menu-toggle icon-button" aria-label="${e(c.menu)}" aria-expanded="false" aria-controls="mobile-nav" data-open-label="${e(c.menu)}" data-close-label="${e(c.closeMenu)}">${icon('menu')}</button></div>
</div><nav class="mobile-nav container" id="mobile-nav" aria-label="${c.lang==='en'?'Mobile navigation':'Мобильная навигация'}" hidden>${c.nav.map((s,i)=>`<a href="#${['features','how-it-works','models'][i]}">${e(s)}</a>`).join('')}<a href="#get-started">${e(c.get)} ${icon('arrow-up-right')}</a></nav></header>
<main id="main">
  <section class="hero container">
    <div class="hero-copy"><p class="eyebrow hero-eyebrow"><span class="tiny-spark" aria-hidden="true">✳</span>${e(c.eyebrow)}</p>
    <h1>${e(c.headline[0])}<br><span>${e(c.headline[1])}</span></h1>
    <p class="hero-description">${e(c.intro)}</p>
    <div class="hero-actions"><a href="#tour" class="button">${e(c.primary)}${icon('arrow')}</a><a href="${repo}" ${ext} class="text-link">${e(c.secondary)}${icon('arrow-up-right')}</a></div>
    <div class="hero-meta"><span>${icon('monitor')}${e(c.platform)}</span><span>${icon('file')}${e(c.format)}</span></div></div>
    <div class="hero-mascot" aria-hidden="true"><span class="mascot-orbit"></span><img src="${e(local('/assets/squid.webp'))}" alt="" width="228" height="190"><span class="mascot-caption">${c.lang==='en'?'hello, curious mind.':'привет, любопытный ум.'}</span></div>
  </section>

  <section id="tour" class="tour container" aria-label="${e(c.tourLabel)}" data-tabs>
    <div class="tour-topline"><p>${e(c.tourLabel)}</p><div class="tour-tabs" role="tablist" aria-label="${e(c.tourLabel)}">${c.tabs.map(t=>`<button role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${t.id==='visual'}" tabindex="${t.id==='visual'?'0':'-1'}" data-tab="${t.id}">${icon(t.icon)}${e(t.label)}</button>`).join('')}</div></div>
    <div class="tour-stage">${c.tabs.map(t=>`<div id="panel-${t.id}" role="tabpanel" aria-labelledby="tab-${t.id}" tabindex="0" ${t.id!=='visual'?'hidden':''}>${screenshot(t.id,t.alt,'tour-shot',t.id==='visual')}<div class="tour-explanation"><h2>${e(t.title)}</h2><p>${e(t.text)}</p><span class="tour-index" aria-hidden="true">0${c.tabs.indexOf(t)+1} / 03</span></div></div>`).join('')}</div>
    <p class="screenshot-note">${e(c.screenshotNote)}</p>
    <ul class="conversation-features">${c.conversationFeatures.map(text=>`<li>${icon('check')}${e(text)}</li>`).join('')}</ul>
  </section>

  <section class="providers container" aria-label="${e(c.providersIntro)}"><p>${e(c.providersIntro)}</p><div class="provider-list">${providers.map(([i,name])=>`<span><img src="${e(local('/assets/providers/'+i+'.svg'))}" alt="" width="24" height="24" loading="lazy">${name}</span>`).join('')}</div><a href="#models" class="subtle-link">${e(c.providersMore)}${icon('arrow')}</a></section>

  <section id="features" class="features container section-pad">
    <div class="section-heading"><p class="eyebrow">${e(c.featuresEyebrow)}</p><h2>${e(c.featuresTitle[0])}<br><span>${e(c.featuresTitle[1])}</span></h2><p class="section-description">${e(c.featuresIntro)}</p></div>
    ${feature(c.reading)}${feature(c.notes,true)}
  </section>

  <section class="proof-section section-pad"><div class="container">
    <div class="split-heading"><div><p class="eyebrow">${e(c.proofEyebrow)}</p><h2>${e(c.proofTitle)}</h2></div><p>${e(c.proofIntro)}</p></div>
    <div class="proof-grid">${c.proof.map(f=>`<article class="proof-card"><div class="proof-image">${screenshot(f.shot,f.alt,'crop-'+f.crop)}</div><div class="proof-copy">${icon(f.icon)}<h3>${e(f.title)}</h3><p>${e(f.text)}</p></div></article>`).join('')}</div>
  </div></section>

  <section id="models" class="models-section container section-pad"><div class="models-copy"><p class="eyebrow">${e(c.modelsEyebrow)}</p><h2>${e(c.modelsTitle[0])}<br><span>${e(c.modelsTitle[1])}</span></h2><p class="section-description">${e(c.modelsDescription)}</p><div class="connection-groups">${c.connectionGroups.map(g=>`<div><p class="eyebrow">${e(g.label)}</p><h3>${e(g.title)}</h3><p>${e(g.text)}</p></div>`).join('')}</div><p class="fine-print">${e(c.modelNote)}</p></div><div class="models-visual"><div class="connection-orbit" aria-hidden="true">${['openai','claude','gemini','opencode','openrouter'].map(n=>`<span><img src="${e(local('/assets/providers/'+n+'.svg'))}" alt="" width="32" height="32" loading="lazy"></span>`).join('')}</div>${screenshot('connections',c.connectionsAlt,'settings-shot')}</div></section>

  <section class="extras-section container section-pad"><div class="section-heading compact"><p class="eyebrow">${e(c.extrasEyebrow)}</p><h2>${e(c.extrasTitle)}</h2></div><div class="extras-grid">${c.extras.map(f=>`<article class="extra-card">${icon(f.icon)}<h3>${e(f.title)}</h3><p>${e(f.text)}</p><button class="text-link" data-lightbox="${asset(c.lang,f.shot)}" data-alt="${e(f.alt)}">${e(c.viewScreen)}${icon('arrow-up-right')}</button></article>`).join('')}</div></section>

  <section id="how-it-works" class="workflow-section section-pad"><div class="container"><div class="section-heading"><p class="eyebrow">${e(c.workflowEyebrow)}</p><h2>${e(c.workflowTitle)}</h2></div><ol class="workflow-steps">${c.steps.map((s,i)=>`<li><span class="step-number">0${i+1}</span><h3>${e(s.title)}</h3><p>${e(s.text)}</p></li>`).join('')}</ol><aside class="privacy-note">${icon('shield')}<div><h3>${e(c.privacyTitle)}</h3><p>${e(c.privacyText)}</p></div></aside></div></section>

  <section class="faq-section container section-pad"><div class="faq-heading"><p class="eyebrow">${e(c.faqEyebrow)}</p><h2>${e(c.faqTitle)}</h2><img class="faq-mascot" src="${e(local('/assets/squid.webp'))}" alt="" width="100" height="84" loading="lazy"></div><div class="faq-list">${c.faq.map((f,i)=>`<details name="faq"><summary>${e(f.q)}${icon('plus')}</summary><div class="faq-answer"><p>${e(f.a)}</p>${i===4?`<a class="text-link" href="${repo}#запуск" ${ext}>${e(c.ctaGuide)}${icon('arrow-up-right')}</a>`:''}</div></details>`).join('')}</div></section>

  <section id="get-started" class="cta-section container"><div class="cta-inner"><p class="eyebrow">${e(c.ctaEyebrow)}</p><h2>${e(c.ctaTitle[0])}<br>${e(c.ctaTitle[1])}</h2><p>${e(c.ctaText)}</p><div class="cta-actions"><a class="button button-light" href="${repo}" ${ext}>${icon('github')}${e(c.ctaButton)}${icon('arrow-up-right')}</a><a class="text-link" href="${repo}#запуск" ${ext}>${e(c.ctaGuide)}${icon('arrow')}</a></div><span class="cta-note">${e(c.ctaNote)}</span><img class="cta-mascot" src="${e(local('/assets/squid.webp'))}" alt="" width="190" height="160" loading="lazy"></div></section>
</main>
<footer class="site-footer container"><div class="footer-top"><div><a class="brand" href="${e(local(localeHref(c.lang)))}" aria-label="kepodo"><img src="${e(local('/assets/wordmark.png'))}" alt="kepodo" width="121" height="33" loading="lazy"></a><p>${e(c.footer)}</p></div><nav aria-label="${c.lang==='en'?'Footer links':'Ссылки в подвале'}">${[repo,repo+'#запуск',repo+'/issues'].map((href,i)=>`<a href="${href}" ${ext}>${e(c.footerLinks[i])}${icon('arrow-up-right')}</a>`).join('')}</nav></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} kepodo</span><span>${e(c.footerNote)}</span><div class="language-switch"><a href="${e(local(localeHref('en')))}" lang="en" hreflang="en" ${c.lang==='en'?'aria-current="page"':''}>English</a><span>/</span><a href="${e(local(localeHref('ru')))}" lang="ru" hreflang="ru" ${c.lang==='ru'?'aria-current="page"':''}>Русский</a></div></div></footer>
<dialog class="lightbox" aria-label="${e(c.zoom)}"><div class="lightbox-toolbar"><p>${e(c.screenshotNote)}</p><button class="icon-button lightbox-close" aria-label="${e(c.close)}">${icon('x')}</button></div><div class="lightbox-scroll"><img alt="" width="1360" height="900"></div><p class="lightbox-caption"></p></dialog>
</body></html>`;
}
