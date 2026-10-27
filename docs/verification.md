# Verification — 2026-10-27

- `npm run build` — passed. Static English and Russian output in `dist/`.
- `npm test` — 6 tests passed for both the local build and `SITE_URL=https://rusakoff.github.io/kepodo_website`. Localized content, screenshot locale, local assets, anchor targets, control IDs, image metadata, Open Graph dimensions, feature parity, root page, 404 links, GitHub Pages base paths, CSS font URLs, production canonical URLs, robots.txt, and sitemap checked.
- Browser layout — English and Russian checked at 320, 390, 768, and 1440 CSS pixels. No horizontal page overflow or broken loaded images. The 768px English check was repeated after waiting for the browser resize to settle.
- Interactions — all three scenario tabs, ArrowRight and Home keyboard selection, mobile navigation, language switching with section preservation, FAQ, screenshot enlargement, Escape, and focus return verified in the T3 browser.
- Screenshot capture — 26 WebP images from the real Electron app using isolated demonstration profiles. No real model requests or personal profile data.
- Social previews — English and Russian 1200 × 630 PNGs rendered and checked. Local Manrope font and original kepodo assets.
- Product sources — original project Git status matches the starting state. No application source changes were made for the website.

The deployment target is `https://rusakoff.github.io/kepodo_website/`, using GitHub Actions and GitHub Pages. The workflow obtains `SITE_URL` from `actions/configure-pages`, builds, tests, and deploys on pushes to `main`. No published installer URL was provided; the site uses the verified GitHub source and setup links.

The browser size checks are saved in `docs/qa/layout.json`; a rendered first-screen preview is in `docs/qa/landing-ru.png`. QA artifacts are excluded from Git.
