# Editorial hero — concrete and newspaper

The opening combines a quiet concrete wall, independently positioned French and Japanese newspaper cutouts, and a small live-HTML note. The product headline remains selectable and localized, pairing Manrope with an italic Georgia second line. All decorative pieces stay in a separate grid column on desktop and move below the copy on phones. The header stays transparent. Buttons in the opening use restrained rectangular shapes.

## Final project assets

- `public/assets/hero-concrete.webp` — 1280 × 854, about 86 KiB. Matte warm-grey concrete, used at 42% opacity over `#deded6`.
- `public/assets/hero-newspaper-fr.webp` — 1320 × 852, about 238 KiB, alpha preserved. Main clipping with the tram photograph and one piece of matte tape.
- `public/assets/hero-newspaper-jp.webp` — 512 × 1281, about 117 KiB, alpha preserved. A quieter secondary clipping with no tape.
- `public/assets/og-en.png` and `public/assets/og-ru.png` — 1200 × 630. Browser-rendered from the same hero markup, stylesheet and materials via `scripts/make-social-pages.mjs`.

Generation mode: built-in `image_gen`, not the CLI fallback. The existing `public/assets/hero-collage.webp` was supplied as the visual reference for both paper cutouts. It is retained as source material, together with the earlier 960px variant; the current hero no longer loads either composite image. Generated PNGs were converted to WebP with `cwebp`; alpha was preserved and no manual raster compositing was used.

The newspapers and note are decorative and hidden from assistive technology. Essential product copy, links, language controls and the real application tour remain live HTML. The note is localized: “What connects these ideas?” / “Что связывает эти идеи?”. The original screenshot tour supplies the actual product context immediately below the opening.

## Final generation prompts

### Concrete — new opaque texture

```text
Use case: photorealistic-natural. Asset type: seamless photographic concrete material texture for a refined reading-app website background, NOT an illustration or mockup. Generate a wide landscape image, approximately 1536 x 1024. Subject: an entirely empty, finely cast pale warm-grey cement wall, viewed perfectly straight-on at close range. The wall is matte, dry, softly mineral, with delicate natural cloudy variation, a few tiny subtle pores and fine sand grain. Target average colour #deded6, low contrast and uniform brightness across the whole canvas so dark website text is perfectly legible over it. Very soft broad diffuse frontal daylight, almost no directional shading. Cement should look tactile and real but calm, elegant and contemporary, not dirty or distressed. A seamless tile with matching edges, no visible repeating large features. No paper, no newspaper, no tape, no objects, no letters, no text, no logos, no cracks, no lines, no panels, no stains, no vignette, no gradients fading to white.
```

### French newspaper — transparent reference edit

```text
Use case: background-extraction / identity-preserve. Asset type: isolated photographic newspaper cutout for a refined editorial website. The supplied image is the visual reference. Create ONLY the large French newspaper clipping, isolated on a truly transparent alpha background. Remove the wall, the Japanese clipping and the car card. Preserve the recognizable large black serif heading exactly: "Le temps de lire", the antique black-and-white city tram photograph to the right, and a short French reading-themed article column at the left. Contemporary premium art direction: paper is pale off-white newsprint, not yellow or brown, with fine natural fibres and one subtle fold. The top and side edges are mostly scissors-cut, with a delicately torn irregular bottom edge. Keep the full newspaper, complete edges and all corners inside the canvas with small transparent margins. Layout is a landscape rectangle, approximately 1.55:1, perfectly front-on, not tilted, so rotation can be controlled in CSS. One small understated semi-transparent matte beige masking tape strip at the upper left corner, extending just beyond the newspaper. Soft diffuse daylight from upper left, very restrained contact shadow. No wall or background colour. No extra paper, no car, no website layout, no UI, no buttons, no extra logos, no watermarks, no decorative stains or exaggerated distress.
```

### Japanese newspaper — transparent reference edit

```text
Use case: background-extraction / identity-preserve. Asset type: isolated photographic Japanese newspaper clipping, a quiet secondary collage element. The supplied image is the visual reference. Create ONLY the narrow vertical Japanese newspaper clipping from the far right, on a truly transparent alpha background. Remove the French newspaper, the car and the wall. Retain the large Japanese serif headline at top and narrow Japanese newspaper text columns about everyday reading, plus a small black-and-white city photograph at the bottom. Pale cool off-white newsprint, subtle paper fibres, much less yellow than the reference. Straight neatly scissors-cut left and right edges, slightly irregular bottom, a single soft vertical fold, natural clean paper with gentle wear. The asset is an upright portrait clipping, approximately 1:2.5, perfectly front-on, no rotation; all corners completely inside the canvas with small transparent margins. Soft diffuse daylight from upper left matching the main newspaper. No tape: the main clipping alone will have tape. No strong cast shadow, no background, no car, no French paper, no extra objects, no watermarks, no UI.
```

## Previous composite artwork

The earlier art direction and original landscape-generation prompt are retained below as provenance.

# Hero illustration

The website adapts the newspaper collage on the kepodo startup screen into a wide, tactile editorial composition. The copy stays live HTML and is localized; the illustration is shared across both languages.

Source: `../MarkChat/src/renderer/assets/welcome-collage.png`.

Mode: built-in `image_gen` with the original image as reference.

Final assets: `public/assets/hero-collage.webp` (1774 × 887, 352 KB) and `public/assets/hero-collage-960.webp` (960 × 480, 78 KB). The full landscape is used on desktop; CSS reframes the same art below the copy on smaller screens. Images are decorative, never carry essential product text, and have empty alternative text. The hero no longer uses the squid mascot. Both Open Graph previews use the new collage.

## Generation prompt

```text
Use case: compositing
Asset type: wide editorial hero background for the kepodo reading application website.
Primary request: Adapt the supplied portrait startup artwork into a polished LANDSCAPE 2:1 composition (2400 x 1200 if possible) for a website. Keep its distinctive photographic paper collage style, not a drawing and not a website screenshot.
Input image: the supplied image is the source artwork and exact visual reference.
Scene/backdrop: pale warm ivory plaster and paper texture, softly lit, subtle grain. Match the original materials and aged paper. The LEFT 54% of the canvas must be almost empty, calm light ivory with very faint texture, reserved for large live HTML headline and two buttons. No objects or typography in that left area.
Subject and placement: arrange the original three paper pieces in the RIGHT 46% as a beautiful curated editorial collage: the large French newspaper clipping titled "Le temps de lire" with a black and white vintage tram photograph, the tall Japanese newspaper clipping with its small black and white city photo on the far right, and the small worn black TURBO trading card with the green sports car below the main clipping. Keep all three motifs clearly recognizable and preserve their original visual identities. Use original torn irregular paper edges, crease marks, aged masking tape at top left of main clipping and gold tape on Japanese clipping, and subtle realistic contact shadows. Place the collage approximately from x=55% to x=98% and y=14% to y=91%. The main French clipping is largest, Japanese clipping tall and narrower to its right, card below the main French clipping at a slight natural angle. Allow subtle overlaps for depth, but do not hide the main photographs. Keep the entirety of the paper pieces within canvas. This arrangement should use the full height confidently, not float as tiny objects.
Color palette: muted cream, warm gray, charcoal print; green car and gold tape as quiet accents. Background edges should stay warm ivory, approximately #f0efec, seamlessly usable with a light warm gray webpage.
Lighting/mood: soft natural daylight, tactile and thoughtful, premium magazine art direction.
Constraints: this is artwork ONLY. No website elements, buttons, logo, main headline, labels, octopus, squid, characters, colorful gradients, extra decorative objects, or watermarks. Keep the calm blank left half. Preserve original image content and editorial character while changing layout and aspect ratio.
```
