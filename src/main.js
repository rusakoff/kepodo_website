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

// Keep the current section when changing language; each language has its own URL.
document.querySelectorAll('.language-switch a').forEach(link => {
  link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.hash = location.hash;
    link.href = url.href;
  });
});

// Keep native scrolling; reveal each story once as it enters the viewport.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [...document.querySelectorAll('.manifesto, .tour-heading, .feature-row, .split-heading, .proof-card, .models-copy, .models-visual, .extra-card, .workflow-steps li, .faq-heading')];
let revealObserver;
const configureReveals = () => {
  revealObserver?.disconnect();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.remove('reveal-ready'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  for (const element of revealElements) {
    // Content already passed or visible remains visible on restoration/navigation.
    if (element.getBoundingClientRect().top < innerHeight) continue;
    element.classList.add('reveal-ready');
    revealObserver.observe(element);
  }
};
configureReveals();
reducedMotion.addEventListener('change', configureReveals);

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
