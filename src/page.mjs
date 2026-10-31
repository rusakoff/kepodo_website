export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHtml;
const paths = {
  'align-left': '<path d="M4 6h16M4 12h12M4 18h8"/>',
  network: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  lightbulb: '<path d="M9 18h6m-5 3h4M9 15a6 6 0 1 1 6 0v1H9z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  zoom: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
  book: '<path d="M12 7v14m0-14C9 4 5 3 2 4v15c3-1 7 0 10 2 3-2 7-3 10-2V4c-3-1-7 0-10 3Z"/>',
  note: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M9 15l1-4L20 1l3 3-10 10-4 1Z"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  key: '<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-6-6 3-3m0 6 3-3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 8 4 4-4 4m7 0h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
  github: '<path d="M9 19c-5 1-5-2-7-2m14 5v-4a3 3 0 0 0-.9-2.3c3-.3 5.9-1.5 5.9-6.7a5.2 5.2 0 0 0-1.4-3.6 4.9 4.9 0 0 0-.1-3.6S18.4 1.5 15.8 3a13.2 13.2 0 0 0-7.6 0C5.6 1.5 4.5 1.8 4.5 1.8a4.9 4.9 0 0 0-.1 3.6A5.2 5.2 0 0 0 3 9c0 5.2 2.9 6.4 5.9 6.7A3 3 0 0 0 8 18v4"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
export const brandMarkup = (basePath = '') => `<img class="brand-logo" src="${e(basePath + '/assets/wordmark.png')}" alt="kepodo" width="946" height="258">`;
export const tabletMarkup = screen => `<div class="tablet"><span class="tablet-camera" aria-hidden="true"></span><div class="tablet-display">${screen}</div></div>`;
const repo = 'https://github.com/rusakoff/kepodo';
const ext = 'target="_blank" rel="noopener noreferrer"';
const providers = [['openai','ChatGPT'],['claude','Claude Code'],['openai','Codex'],['opencode','OpenCode'],['openrouter','OpenRouter'],['gemini','Gemini']];

export function page(c, siteUrl = '') {
  const basePath = siteUrl ? new URL(siteUrl).pathname.replace(/\/$/, '') : '';
  const local = path => basePath + path;
  const asset = name => local(`/assets/screenshots/${c.lang}-${name}.webp`);
  const localeHref = lang => `/${lang}/`;
  const navIds = ['features', 'models', 'faq'];
  const brand = brandMarkup(basePath);
  const screenshot = (shot, alt, cls = '', priority = false, zoomable = true) => {
    const [width, height] = ['connections','skills','settings'].includes(shot) ? [1180,1800] : shot === 'reading' ? [1556,1700] : [2720,1800];
    const light = asset(shot === 'dark' ? 'visual' : shot);
    const dark = asset(shot === 'dark' ? 'dark' : `${shot}-dark`);
    const image = `<img src="${dark}" data-src-light="${light}" data-src-dark="${dark}" alt="${e(alt)}" width="${width}" height="${height}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
    return zoomable ? `<button class="screenshot ${cls}" type="button" data-lightbox="${dark}" data-lightbox-light="${light}" data-lightbox-dark="${dark}" aria-label="${e(c.zoom)}: ${e(alt)}">${image}<span class="zoom-hint">${icon('zoom')}</span></button>` : image;
  };
  const mockup = (shot, alt, cls = '', priority = false) => `<div class="app-window ${cls}">${screenshot(shot, alt, '', priority)}</div>`;
  const heroSlides = [['dark', c.heroAlt], ['summary', c.tabs.find(tab => tab.id === 'summary').alt], ['notes', c.notes.alt]];
  const slideshow = `<div class="hero-slides" id="hero-slides">${heroSlides.map(([shot, alt], i) => `<div class="hero-slide${i === 0 ? ' is-active' : ''}" data-slide role="group" aria-roledescription="${c.lang === 'ru' ? 'слайд' : 'slide'}" aria-label="${i + 1} / ${heroSlides.length}: ${e(c.slideshowSlides[i])}" aria-hidden="${i !== 0}" ${i === 0 ? '' : 'inert'}>${screenshot(shot, alt, '', i === 0, false)}</div>`).join('')}</div>`;
  const feature = f => `<article id="${f.shot}" class="product-row ${f.shot}-row"><div class="product-copy"><h2>${e(f.title)}</h2><p>${e(f.description)}</p><ul class="check-list">${f.tags.map(tag => `<li>${icon('check')}${e(tag)}</li>`).join('')}</ul></div><div class="product-visual">${mockup(f.shot, f.alt)}</div></article>`;
  const providerLogo = (glyph, cls = '') => `<img class="provider-logo provider-${glyph} ${cls}" src="${e(local('/assets/providers/' + glyph + '.svg'))}" alt="" width="28" height="28">`;
  const languageLinks = () => ['en', 'ru'].map(lang => `<a href="${e(local(localeHref(lang)))}" lang="${lang}" hreflang="${lang}" ${c.lang === lang ? 'aria-current="page"' : ''}>${lang === 'en' ? 'English' : 'Русский'}${c.lang === lang ? icon('check') : ''}</a>`).join('');
  return `<!doctype html>
<html lang="${c.lang}" data-theme="dark">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(c.title)}</title><meta name="description" content="${e(c.description)}">
  <meta name="theme-color" content="#000000"><meta name="color-scheme" content="dark light">
  <script>document.documentElement.classList.add('js');try{if(localStorage.getItem('kepodo-theme')==='light'){document.documentElement.dataset.theme='light';document.querySelector('meta[name="theme-color"]').content='#fafafa'}}catch{}</script>
  <link rel="canonical" href="${e(siteUrl + localeHref(c.lang))}">
  <link rel="alternate" hreflang="en" href="${e(siteUrl + '/en/')}"><link rel="alternate" hreflang="ru" href="${e(siteUrl + '/ru/')}"><link rel="alternate" hreflang="x-default" href="${e(siteUrl + '/en/')}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="kepodo"><meta property="og:title" content="${e(c.title)}"><meta property="og:description" content="${e(c.description)}"><meta property="og:locale" content="${c.locale}">
  <meta property="og:image" content="${e(siteUrl + '/assets/og-' + c.lang + '.png')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(c.title)}">
  ${siteUrl ? `<meta property="og:url" content="${e(siteUrl + localeHref(c.lang))}">` : ''}<meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="${e(local('/favicon.png'))}">
  <link rel="stylesheet" href="${e(local('/styles.css'))}"><script src="${e(local('/main.js'))}" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${e(c.skip)}</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${e(local(localeHref(c.lang)))}" aria-label="kepodo">${brand}</a>
    <nav class="desktop-nav" aria-label="${c.lang === 'en' ? 'Main navigation' : 'Основная навигация'}">${c.nav.map((label, i) => `<a data-section-link href="#${navIds[i]}">${e(label)}</a>`).join('')}</nav>
    <div class="header-end">
      <details class="language-picker"><summary aria-label="${c.lang === 'en' ? 'Choose language' : 'Выбрать язык'}">${icon('globe')}<span>${c.lang.toUpperCase()}</span>${icon('chevron', 'language-chevron')}</summary><nav class="language-switch language-options" aria-label="${c.lang === 'en' ? 'Language' : 'Язык'}">${languageLinks()}</nav></details>
      <button class="theme-toggle icon-button" type="button" aria-label="${e(c.themeLight)}" data-light-label="${e(c.themeLight)}" data-dark-label="${e(c.themeDark)}">${icon('sun', 'sun-icon')}${icon('moon', 'moon-icon')}</button>
      <a class="header-cta" href="#tour">${e(c.get)}</a>
      <button class="menu-toggle icon-button" type="button" aria-label="${e(c.menu)}" aria-expanded="false" aria-controls="mobile-nav" data-open-label="${e(c.menu)}" data-close-label="${e(c.closeMenu)}">${icon('menu', 'menu-icon')}${icon('x', 'close-icon')}</button>
    </div>
  </div>
  <nav class="mobile-nav container" id="mobile-nav" aria-label="${c.lang === 'en' ? 'Mobile navigation' : 'Мобильная навигация'}" hidden>${c.nav.map((label, i) => `<a data-section-link href="#${navIds[i]}">${e(label)}${icon('arrow')}</a>`).join('')}<a href="#tour">${e(c.get)}${icon('play')}</a></nav>
</header>
<main id="main">
  <section class="hero">
    <div class="hero-inner container">
      <div class="hero-floats" aria-hidden="true">${[['claude','claude'],['opencode','opencode'],['gemini','gemini'],['openai','openai'],['openrouter','openrouter'],['openai','codex']].map(([glyph, name]) => `<span class="hero-float float-${name}">${providerLogo(glyph)}</span>`).join('')}</div>
      <div class="hero-copy">
        <h1>${c.headline.map(line => `<span class="headline-line">${e(line)}</span>`).join('')}</h1>
        <p class="hero-description">${e(c.intro)}</p>
        <div class="hero-actions"><a href="#tour" class="button">${icon('book')}${e(c.primary)}</a><a href="#film" class="hero-secondary">${icon('play')}${e(c.secondary)}<span class="duration">0:28</span>${icon('external')}</a></div>
        <p class="hero-meta">${e(c.format)}</p>
      </div>
    </div>
    <figure class="hero-product tablet-scene" data-slideshow role="region" aria-roledescription="${c.lang === 'ru' ? 'карусель' : 'carousel'}" aria-label="${e(c.slideshowLabel)}">${tabletMarkup(slideshow)}<div class="slideshow-controls" hidden><div class="slideshow-dots">${heroSlides.map((_, i) => `<button class="slide-dot" type="button" data-slide-to="${i}" aria-label="${e(c.slideshowSlides[i])}" aria-controls="hero-slides" aria-pressed="${i === 0}"><span aria-hidden="true"></span></button>`).join('')}</div><button class="slideshow-toggle icon-button" type="button" data-slideshow-toggle data-pause-label="${e(c.slideshowPause)}" data-play-label="${e(c.slideshowPlay)}" aria-label="${e(c.slideshowPause)}" aria-controls="hero-slides">${icon('pause', 'pause-icon')}${icon('play', 'play-icon')}</button></div><figcaption class="sr-only">${e(c.previewLabel)}. ${e(c.screenshotNote)}</figcaption></figure>
  </section>

  <section id="features" class="features container section-pad">
    <div class="section-heading"><div><h2>${e(c.casesTitle)}</h2></div><p class="section-description">${e(c.featuresDescription)}</p></div>
    <div class="use-cases">${c.cases.map((item, i) => `<article class="use-case"><p class="case-label">${icon(c.tabs[i].icon)}${e(item.label)}</p><h3>${e(item.title)}</h3><p>${e(item.text)}</p><a class="prompt-link" href="#tour" data-demo-tab="${e(item.tab)}">${e(item.prompt)}${icon('arrow')}</a></article>`).join('')}</div>
  </section>

  <section id="models" class="models-section section-pad"><div class="container">
    <div class="section-heading"><h2>${e(c.modelsTitle)}</h2><p class="section-description">${e(c.modelsDescription)}</p></div>
    <div class="provider-list">${providers.map(([glyph, name], i) => `<div class="provider-item">${providerLogo(glyph)}<span><strong>${name}</strong><small>${e(c.providerTags[i])}</small></span></div>`).join('')}</div>
    <ul class="provider-proof check-list">${c.proof.map(item => `<li>${icon('check')}${e(item)}</li>`).join('')}</ul>
    <div class="connection-bottom"><p class="fine-print">${e(c.modelNote)}</p><button class="text-link" type="button" data-lightbox="${asset('connections-dark')}" data-lightbox-dark="${asset('connections-dark')}" data-lightbox-light="${asset('connections')}" data-alt="${e(c.connectionsAlt)}">${e(c.connectionView)}${icon('external')}</button></div>
  </div></section>

  <section id="tour" class="tour container section-pad" aria-label="${e(c.tourLabel)}" data-tabs>
    <div class="section-heading"><h2>${e(c.tourLabel)}</h2><p class="section-description">${e(c.tourDescription)}</p></div>
    <div class="tour-tabs" role="tablist" aria-label="${e(c.tourLabel)}">${c.tabs.map(t => `<button role="tab" id="tab-${t.id}" aria-controls="panel-${t.id}" aria-selected="${t.id === 'summary'}" tabindex="${t.id === 'summary' ? '0' : '-1'}" data-tab="${t.id}">${icon(t.icon)}${e(t.label)}</button>`).join('')}</div>
    <div class="tour-stage">${c.tabs.map(t => `<div id="panel-${t.id}" role="tabpanel" aria-labelledby="tab-${t.id}" tabindex="0" ${t.id !== 'summary' ? 'hidden' : ''}><div class="tour-panel"><div class="tour-copy"><div><h3>${e(t.title)}</h3><p>${e(t.text)}</p></div><div class="example-prompt"><span>${e(c.exampleLabel)}</span><blockquote>${e(t.prompt)}</blockquote>${icon('arrow')}</div></div><div class="tour-visual">${mockup(t.id, t.alt)}</div></div></div>`).join('')}</div>
    <p class="screenshot-note">${e(c.screenshotNote)}</p>
  </section>

  <section class="reading-notes container" aria-label="${e(c.featureTitle)}">${feature(c.reading)}${feature(c.notes)}</section>

  <section class="control-section container section-pad"><div class="control-inner"><div class="control-copy"><h2>${c.control.headline.map(line => `<span>${e(line)}</span>`).join('')}</h2><p>${e(c.control.description)}</p><ul class="check-list">${c.control.points.map(item => `<li>${icon('check')}${e(item)}</li>`).join('')}</ul></div><figure class="control-visual">${mockup('proposal', c.control.alt)}<figcaption>${e(c.control.label)}</figcaption></figure></div></section>

  <section id="how-it-works" class="workflow-section container section-pad"><div class="section-heading"><h2>${e(c.workflowTitle)}</h2></div><div class="workflow-grid"><figure class="hero-showreel" id="film"><div class="showreel-frame"><video id="hero-video" controls playsinline preload="none" tabindex="0" width="1920" height="1080" poster="${e(local('/assets/videos/kepodo-showreel-' + c.lang + '.webp'))}" aria-label="${e(c.videoTitle)}"><source src="${e(local('/assets/videos/kepodo-showreel-' + c.lang + '.mp4'))}" type="video/mp4"><a href="${e(local('/assets/videos/kepodo-showreel-' + c.lang + '.mp4'))}">${e(c.videoOpen)}</a></video><button class="showreel-play" type="button" aria-controls="hero-video" hidden>${icon('play')}<span>${e(c.videoPlay)}</span><span class="duration" aria-hidden="true">0:28</span></button></div><figcaption>${e(c.videoTitle)}</figcaption></figure><ol class="workflow-steps">${c.steps.map((s, i) => `<li><span class="step-number" aria-hidden="true">${i + 1}</span><div><h3>${e(s.title)}</h3><p>${e(s.text)}</p></div></li>`).join('')}</ol></div><dl class="spec-list">${c.specsValues.map((value, i) => `<div><dt>${e(c.specsHeaders[i])}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>

  <section id="faq" class="faq-section container section-pad"><div class="faq-heading"><h2>${e(c.faqTitle)}</h2><p class="section-description">${e(c.faqDescription)}</p></div><div class="faq-list">${c.faq.map(f => `<details name="faq"><summary>${e(f.q)}${icon('plus')}</summary><div class="faq-answer"><p>${e(f.a)}</p>${f.guide ? `<a class="text-link" href="#setup">${e(c.ctaGuide)}${icon('arrow')}</a>` : ''}</div></details>`).join('')}</div></section>

  <section id="setup" class="source-section section-pad"><div class="container">
    <div class="section-heading centered"><h2>${e(c.setupTitle)}</h2></div>
    <div class="source-grid">
      <div class="code-block"><div class="code-toolbar"><span class="terminal-title"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>~/kepodo</span><button type="button" data-copy-commands data-copied="${e(c.copied)}" data-error="${e(c.copyError)}">${e(c.copy)}</button></div><pre><code><span class="code-command">git clone https://github.com/rusakoff/kepodo.git</span>
<span class="code-command">cd kepodo</span>
<span class="code-command">npm install</span>
<span class="code-command">npm run dev</span></code></pre><p class="copy-status" role="status" aria-live="polite"></p></div>
      <div class="source-info"><ul class="check-list">${c.sourcePoints.map(point => `<li>${icon('check')}${e(point)}</li>`).join('')}</ul><p>${e(c.setupDescription)}</p><a class="text-link" href="${repo}" ${ext}>${icon('github')}${e(c.sourceLink)}${icon('external')}</a></div>
    </div>
  </div></section>

  <section id="get-started" class="cta-section section-pad"><div class="container cta-inner"><h2>${c.ctaTitle.map(line => `<span>${e(line)}</span>`).join('')}</h2><p>${e(c.ctaDescription)}</p><div class="cta-actions"><a class="button" href="#tour">${icon('book')}${e(c.ctaButton)}</a><a class="button button-outline" href="#setup">${icon('terminal')}${e(c.sourceLabel)}</a></div></div></section>
</main>
<footer class="site-footer"><div class="container footer-inner"><a class="brand" href="${e(local(localeHref(c.lang)))}" aria-label="kepodo">${brand}</a><span class="copyright">© ${new Date().getFullYear()} kepodo</span><nav aria-label="${c.lang === 'en' ? 'Footer links' : 'Ссылки в подвале'}">${['#features', '#models', '#setup'].map((href, i) => `<a href="${href}">${e(c.footerLinks[i])}</a>`).join('')}</nav><div class="language-switch footer-languages">${languageLinks()}</div></div></footer>
<dialog class="lightbox" aria-label="${e(c.zoom)}"><div class="lightbox-toolbar"><p>${e(c.screenshotNote)}</p><button class="icon-button lightbox-close" type="button" aria-label="${e(c.close)}">${icon('x')}</button></div><div class="lightbox-scroll"><img alt="" width="1360" height="900"></div><p class="lightbox-caption"></p></dialog>
</body></html>`;
}
