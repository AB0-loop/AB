# Brand assets — drop your favicon pack here

Replace these files with the official Aurum Bespoke artwork. **Keep the exact
filenames.** Nothing in the code needs to change — every reference points here.

| File | Size | Used for |
| --- | --- | --- |
| `aurum-mark.png` | 512×512+ | Header logo, 404 / thank-you pages, source for icons |
| `icon-32.png` | 32×32 | Browser tab (Chrome, Edge, Firefox) |
| `icon-180.png` | 180×180 | iOS home screen (`apple-touch-icon`) |
| `icon-192.png` | 192×192 | Android home screen, PWA |
| `icon-512.png` | 512×512 | PWA splash, high-DPI |
| `og-image.jpg` | 1200×630 | WhatsApp, X, LinkedIn, Facebook link previews |

Also replace `src/app/icon.png` (192×192) and `src/app/apple-icon.png` (180×180)
— Next.js reads those two automatically.

## Already have a favicon pack?

If you generated a pack from realfavicongenerator.net or similar, just rename
its files to match the table above and drop them in.

## Only have the master logo?

Put your square master file at `public/brand/aurum-mark.png`, then run:

```bash
npm run icons
```

That regenerates every size above plus the OG card, and copies the two files
Next.js needs. Transparent PNG or a solid `#09090a` background both work.

## Notes

- Keep the mark on the dark background (`#09090a`) or transparent. A white box
  around the logo will show as a white square on the black header.
- The gold in the brand is `#c8a45c`.
- iOS ignores transparency and composites onto white, which is why
  `icon-180.png` is generated with the dark background baked in.
