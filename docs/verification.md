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

## Transparent header and readable typography — 2026-10-27

- Header now overlays the hero with a transparent background and no border. The desktop illustration starts at document y=0; a single vertical mask fades its bottom edge into the tour section. Mobile uses the same paper texture behind the header and copy, with the collage below the copy.
- Increased navigation, buttons, body copy, captions, cards, FAQ, and footer type sizes. Product descriptions are 16–20px; small captions are 13–14px. Mobile feature cards use one column. Long tab labels wrap at 14px instead of overflowing or shrinking.
- Removed chapter badges, workflow numbers, the tour counter, their CSS rules, and unused number fields in both locales.
- Both local and GitHub Pages builds passed all 6 static tests. `git diff --check` passed.
- Checked complete EN/RU layouts at desktop, tablet, and phone widths, including the 320px Russian tab labels and the 901px navigation breakpoint. No page overflow or clipped text after the tab fix. Actual browser measurements confirm transparent header, 0px border, and hero/artwork starting at y=0.
- Verified scenario tabs, keyboard navigation, mobile menu open/Escape close, and live screenshot enlargement/close. QA measurements: `docs/qa/readability-layout.json`.

## Concrete and editorial paper — 2026-10-27

- Generated a new low-contrast concrete material and separate transparent French/Japanese newspaper cutouts with built-in `image_gen`. Final assets and exact prompts are documented in `hero-art-direction.md`. Concrete is about 86 KiB; paper alpha is preserved.
- Replaced the fixed composite background with an independent grid column for the collage. Added an italic serif second headline line, quieter rectangular opening buttons, and a localized paper note with a restrained pencil underline. The header remains transparent. On phones the collage follows the copy.
- Both local and GitHub Pages production builds passed all 6 static tests. `git diff --check` passed.
- Checked both locales at 320, 390, 768, 901, 1024, 1440, and 1920 CSS pixels in Ego Lite. No horizontal page overflow, overflowing headline/note, or broken image with a source URL. The final 320px Russian eyebrow uses 12px type and was checked again after that adjustment.
- Verified mobile menu open/Escape close, hero CTA, tour tabs, ArrowRight/Home selection, screenshot enlargement/Escape close, and language switching while preserving the current section.
- Regenerated and visually checked both 1200 × 630 Open Graph PNGs using the same hero markup and stylesheet. Temporary social pages are removed by the production build.
- The T3 snapshot endpoint twice returned `Preview automation snapshot timed out after 15000ms`; visual and interaction checks therefore used Ego Lite. Layout measurements and desktop/mobile PNGs are saved under the Git-ignored `docs/qa/editorial-*` paths.

## Two26-inspired complete redesign — 2026-10-27

- Reference inspected at https://two26.studio/. Adapted its orange `#ff5400`, warm paper `#f8eee8`, blush `#f9e2e1`, cream `#fdf8f5`, oversized lettering and illustrated editorial direction to kepodo. No reference site illustrations, copy or proprietary fonts were reused.
- Replaced the entire stylesheet and hero composition. Added a custom SVG reading companion, decorative document/idea cards, compact centered masthead, product window framing, contrasting section backgrounds, large feature stories, orange CTA and oversized footer. All substantive product behavior remains represented in English and Russian.
- Self-hosted Unbounded variable font with its OFL license. Original app screenshots and provider icons are retained. Both Open Graph images regenerated at 1200 × 630 with the new design.
- Browser checks in Ego Lite: EN/RU at 320, 390, 650, 768, 901, 1024, 1440 and 1920 CSS pixels. No horizontal page overflow or broken loaded assets. A Russian FAQ heading initially overflowed at 320px; shortened and rechecked successfully. QA output and screenshots are under ignored `docs/qa/two26-*` paths.
- Verified mobile navigation open, Escape close and focus return; hero anchor; scenario tabs and ArrowRight/Home/End keyboard selection; screenshot dialog, Escape, focus return and body scroll restoration; FAQ expansion; EN/RU switching with the current hash preserved.
- Verified `prefers-reduced-motion: reduce` disables ticker/entrance motion, restores native instant scrolling and leaves all reveal content visible. Scroll is never intercepted. Reveals use IntersectionObserver with readable HTML as the default.
- T3 snapshot failed twice with `Preview automation snapshot timed out after 15000ms`; its resize setting also reported 390px while the actual viewport remained 1280px. Used Ego Lite for final visual and responsive inspection.
- Large orange foreground lettering uses `#e94b00` (at least 3:1 on the warm backgrounds); orange surfaces retain the reference's `#ff5400`.
- Final local and GitHub Pages base-path builds each passed all 6 existing tests; `git diff --check` passed. Changes remain in the local checkout.
