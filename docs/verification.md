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

## Collage hero revision — 2026-10-27

- Generated a landscape adaptation of the app's original `welcome-collage.png` with the built-in image tool; the complete prompt and asset details are in `hero-art-direction.md`.
- Removed the hero mascot and its unused layout rules. Preserved the bilingual copy, links, screenshots, and lower-page sections. Added responsive WebP artwork and refreshed both 1200 × 630 Open Graph images.
- Build and all 6 static tests passed for both local paths and the GitHub Pages base path.
- Rendered the actual hero HTML/CSS with its local font and images in both languages at 320, 390, 768, 1024, 1440, and 1600 CSS pixels. Verified headline fit, image loading, mobile ordering, and absence of horizontal overflow. No renderer errors. Checks are in `docs/qa/hero-layout.json`; desktop and mobile previews are saved alongside it.
- In the live local site, confirmed the hero button targets the existing tour, locale links resolve correctly, and artwork is decorative for assistive technology. The T3 collaborative tab remained at 1440px despite resize requests; responsive measurements above therefore come from T3's HTML renderer. Its snapshot endpoint twice returned `Preview automation snapshot timed out after 15000ms`; HTML rendering supplied the visual checks.
- No source changes were made to the Electron app. This revision is saved locally; publishing is a separate operation.
