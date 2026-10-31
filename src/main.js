// Theme is applied in the head before paint; storage is optional.
const themeToggle = document.querySelector('.theme-toggle');
const applyTheme = theme => {
  document.documentElement.dataset.theme = theme;
  const label = theme === 'dark' ? themeToggle.dataset.lightLabel : themeToggle.dataset.darkLabel;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#000000' : '#fafafa';
  document.querySelectorAll('[data-src-dark]').forEach(image => {
    const src = theme === 'dark' ? image.dataset.srcDark : image.dataset.srcLight;
    if (image.getAttribute('src') !== src) image.src = src;
  });
  document.querySelectorAll('[data-lightbox-dark]').forEach(trigger => {
    trigger.dataset.lightbox = theme === 'dark' ? trigger.dataset.lightboxDark : trigger.dataset.lightboxLight;
  });
};
applyTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('kepodo-theme', theme); } catch { /* Private storage can be disabled. */ }
});
window.addEventListener('storage', event => {
  if (event.key === 'kepodo-theme') applyTheme(event.newValue === 'light' ? 'light' : 'dark');
});

// Progressive enhancement: all product copy and images are rendered in HTML.
document.querySelectorAll('[data-tabs]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const activate = tab => {
    for (const candidate of tabs) {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
    }
  };
  for (const tab of tabs) {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      const current = tabs.indexOf(tab);
      const index = { ArrowRight:(current+1)%tabs.length, ArrowLeft:(current+tabs.length-1)%tabs.length, Home:0, End:tabs.length-1 }[event.key];
      if (index === undefined) return;
      event.preventDefault(); activate(tabs[index]); tabs[index].focus();
    });
  }
});

// Scenario links lead to the matching, inspectable product example.
document.querySelectorAll('[data-demo-tab]').forEach(link => {
  link.addEventListener('click', () => {
    const tab = document.querySelector(`[data-tab="${link.dataset.demoTab}"]`);
    tab?.click();
    tab?.focus({ preventScroll: true });
  });
});

document.querySelectorAll('[data-copy-commands]').forEach(button => {
  const label = button.textContent;
  let resetLabel;
  button.addEventListener('click', async () => {
    const block = button.closest('.code-block');
    const status = block.querySelector('.copy-status');
    clearTimeout(resetLabel);
    try {
      await navigator.clipboard.writeText(block.querySelector('code').textContent);
      button.textContent = button.dataset.copied;
      status.textContent = button.dataset.copied;
      resetLabel = setTimeout(() => { button.textContent = label; }, 2400);
    } catch {
      status.textContent = button.dataset.error;
      button.textContent = label;
    }
  });
});

const menu = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const closeMenu = () => {
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label',menu.dataset.openLabel);
  mobileNav.hidden = true;
};
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?menu.dataset.closeLabel:menu.dataset.openLabel);
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
matchMedia('(min-width: 901px)').addEventListener('change', event => { if(event.matches) closeMenu(); });

// The native language disclosure also works without JavaScript.
const languagePicker = document.querySelector('.language-picker');
const languageSummary = languagePicker.querySelector('summary');
languagePicker.addEventListener('toggle', () => {
  if (languagePicker.open) closeMenu();
});
menu.addEventListener('click', () => { languagePicker.open = false; });
document.addEventListener('click', event => {
  if (!languagePicker.contains(event.target)) languagePicker.open = false;
  if (!event.target.closest('.site-header') && menu.getAttribute('aria-expanded') === 'true') closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && languagePicker.open) {
    languagePicker.open = false;
    languageSummary.focus();
  }
});

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const dialogScroll = dialog.querySelector('.lightbox-scroll');
let lightboxTrigger;
document.querySelectorAll('[data-lightbox]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    lightboxTrigger = trigger;
    const alt = trigger.dataset.alt || trigger.querySelector('img')?.alt || '';
    dialogImage.alt = alt;
    dialog.querySelector('.lightbox-caption').textContent = alt;
    dialogImage.onload = () => dialogScroll.classList.toggle('portrait',dialogImage.naturalWidth < dialogImage.naturalHeight);
    dialogImage.src = trigger.dataset.lightbox;
    dialogScroll.scrollTo(0,0);
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('.lightbox-close').focus();
  });
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if(event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lightboxTrigger?.focus({preventScroll:true});
});

// Keep the device still while its real product screenshots crossfade.
document.querySelectorAll('[data-slideshow]').forEach(group => {
  const slides = [...group.querySelectorAll('[data-slide]')];
  const dots = [...group.querySelectorAll('[data-slide-to]')];
  const toggle = group.querySelector('[data-slideshow-toggle]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = motion.matches;
  let inView = false;
  let focused = false;
  let resumeWithFocus = false;
  let timer;
  let request = 0;

  const canPlay = () => !paused && (!focused || resumeWithFocus) && inView && !document.hidden && !dialog.open;
  const schedule = () => {
    clearTimeout(timer);
    if (canPlay()) timer = setTimeout(() => show((active + 1) % slides.length), 5000);
  };
  const updateToggle = () => {
    toggle.dataset.paused = String(paused);
    toggle.setAttribute('aria-label', paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel);
  };
  const show = async (index, manual = false) => {
    clearTimeout(timer);
    const currentRequest = ++request;
    const image = slides[index].querySelector('img');
    image.loading = 'eager';
    try { await image.decode(); } catch { /* Keep the current frame if a screenshot cannot load. */ }
    if (currentRequest !== request) return;
    if (!image.naturalWidth || (!manual && !canPlay())) { schedule(); return; }
    active = index;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.inert = !selected;
      dots[i].setAttribute('aria-pressed', String(selected));
    });
    schedule();
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  toggle.addEventListener('click', () => {
    paused = !paused;
    // An explicit Play action also works while the control keeps touch/keyboard focus.
    resumeWithFocus = !paused;
    updateToggle(); schedule();
  });
  group.addEventListener('focusin', () => { focused = true; resumeWithFocus = false; schedule(); });
  group.addEventListener('focusout', event => { focused = group.contains(event.relatedTarget); resumeWithFocus = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  dialog.addEventListener('close', schedule);
  motion.addEventListener('change', () => {
    if (motion.matches) paused = true;
    updateToggle(); schedule();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .2;
      if (inView) slides.forEach(slide => { slide.querySelector('img').loading = 'eager'; });
      schedule();
    }, { threshold: .2 }).observe(group);
  } else {
    inView = true;
    schedule();
  }
  updateToggle();
  group.querySelector('.slideshow-controls').hidden = false;
});

// Keep the current section when changing language; each language has its own URL.
document.querySelectorAll('.language-switch a').forEach(link => {
  link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  });
});

// Mark the chapter being read, including the mobile navigation.
if ('IntersectionObserver' in window) {
  let chapterObserver;
  const links = [...document.querySelectorAll('[data-section-link]')];
  const sections = [...new Set(links.map(link => link.hash.slice(1)))].map(id => document.getElementById(id));
  const updateChapter = () => {
    const current = sections.find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= innerHeight * .4 && rect.bottom > innerHeight * .4;
    });
    links.forEach(link => {
      if (link.hash === `#${current?.id}`) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  };
  const observeChapters = () => {
    chapterObserver?.disconnect();
    const line = Math.round(innerHeight * .4);
    chapterObserver = new IntersectionObserver(updateChapter, {rootMargin:`-${line}px 0px -${innerHeight-line-1}px 0px`});
    sections.forEach(section => chapterObserver.observe(section));
    updateChapter();
  };
  observeChapters();
  window.addEventListener('resize', observeChapters);
}

// The native player works without JS; this is only the branded play affordance.
const heroVideo = document.getElementById('hero-video');
const videoPlay = document.querySelector('.showreel-play');
if (heroVideo && videoPlay) {
  videoPlay.hidden = false;
  videoPlay.addEventListener('click', () => {
    heroVideo.play().catch(() => {
      // Native controls and the direct video link remain available if playback fails.
      videoPlay.hidden = false;
    });
  });
  heroVideo.addEventListener('play', () => {
    if (document.activeElement === videoPlay) heroVideo.focus({ preventScroll: true });
    videoPlay.hidden = true;
  });
  heroVideo.addEventListener('ended', () => { videoPlay.hidden = false; });
}
