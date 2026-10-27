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
