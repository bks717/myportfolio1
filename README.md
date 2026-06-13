# scraperthing

A Node.js toolkit for cloning a Next.js portfolio site into static HTML, CSS, and assets that you can open locally without a backend.

The project includes three ready-to-view pages:

- `index.html` — home / professional page
- `personal.html` — personal page
- `contact.html` — contact page

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

---

## Setup

From the project folder:

```bash
npm install
npx playwright install chromium
```

Playwright is required only if you want to re-clone pages from the live site. You can skip the Playwright step if you only want to view the existing HTML files.

---

## View the site locally

Static files must be served over HTTP (opening `index.html` directly in the browser can break CSS and image paths).

### Option 1: Python (if installed)

```bash
python -m http.server 8080
```

### Option 2: npx (no install)

```bash
npx serve .
```

### Option 3: Node http-server

```bash
npx http-server . -p 8080
```

Then open:

- http://localhost:8080/index.html
- http://localhost:8080/personal.html
- http://localhost:8080/contact.html

---

## Rebuild from the live site

To re-download pages and re-apply fixes in one step:

```bash
node reprocess.js
```

This runs the full pipeline:

1. Clone pages with Playwright (`clone.js`)
2. Fix paths and strip Next.js scripts (`fix_all.js`)
3. Download and localize Next.js image URLs (`fix_next_images.js`)
4. Restore fade-in and hero animations (`fix_animations.js`)

A browser window opens during cloning (`headless: false`) so JavaScript and animations can finish loading.

## Script reference

### Core scraping

| Script                | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| `clone.js`            | Uses Playwright to save fully rendered HTML from a URL                |
| `fetch_assets.js`     | Downloads linked CSS, images, and icons from HTML                     |
| `fetch_css_assets.js` | Downloads fonts and assets referenced in CSS                          |
| `fix_all.js`          | Converts absolute paths to relative, fixes nav links, removes scripts |
| `fix_next_images.js`  | Downloads images behind Next.js `/_next/image` URLs                   |
| `fix_animations.js`   | Adds fade-in and hero spin animations for static viewing              |
| `reprocess.js`        | Runs clone + fix steps for all three pages                            |

### Content and layout tweaks

| Script                                                                 | Purpose                           |
| ---------------------------------------------------------------------- | --------------------------------- |
| `update_texts.js` / `update_texts_2.js`                                | Replace text content in HTML      |
| `update_edu.js` / `extract_edu.js` / `extract_edu_grid.js`             | Education section updates         |
| `align.js` / `fix_align.js` / `fix_align_parent.js` / `fix_overlap.js` | Hero and layout alignment fixes   |
| `scale_hero.js` / `refine_hero.js`                                     | Hero section sizing and styling   |
| `add_glow.js` / `update_glow.js`                                       | Glow and hover effects on cards   |
| `add_themes.js` / `add_white.js` / `add_text_shadow.js`                | Theme and typography tweaks       |
| `add_cyberpunk.js` / `enhance_cyberpunk.js`                            | Cyberpunk-style visual effects    |
| `add_animation.js`                                                     | Additional animation helpers      |
| `update_favicon.js` / `replace_favicon.js`                             | Favicon updates                   |
| `remove_overlays.js`                                                   | Remove overlay elements from HTML |

### Utilities

| Script             | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `strip_scripts.js` | Remove script tags from `index.html` only      |
| `fix_paths.js`     | Fix absolute paths in `index.html` only        |
| `inspect.js`       | Print CSS classes and hex colors found in HTML |
| `find_sections.js` | Inspect page section structure                 |
| `debug_html.js`    | Dump a snippet of HTML for debugging           |

---

## Project structure

```
scraperthing/
├── index.html          # Main page
├── personal.html       # Personal page
├── contact.html        # Contact page
├── _next/              # Downloaded Next.js CSS and chunks
├── images/             # Localized images (created by fix_next_images.js)
├── *.svg / *.png       # Icons and image assets
├── clone.js            # Playwright page cloner
├── fetch_assets.js     # Asset downloader
├── fix_all.js          # Path and link fixer
├── reprocess.js        # Full rebuild pipeline
└── package.json
```

---

## Troubleshooting

**Blank page or missing styles**

- Serve the site with a local HTTP server instead of opening HTML files directly.
- Re-run `node fix_all.js` to ensure paths are relative.

**Images not loading**

- Run `node fix_next_images.js` after cloning.
- Run `node fetch_assets.js <page>.html` for standard `<img>` and `<link>` assets.

**Playwright errors**

- Run `npx playwright install chromium`.
- Make sure you have network access to the source site during cloning.

**Hydration / script errors in the browser**

- `fix_all.js` removes Next.js scripts on purpose. Use the fix scripts rather than restoring original `<script>` tags.

**Clone opens a browser window**

- This is expected. `clone.js` uses a visible browser so the page fully renders before saving HTML.

---

## Dependencies

- [playwright](https://playwright.dev/) — headless browser for cloning rendered pages
- [axios](https://axios-http.com/) — HTTP downloads for assets
- [cheerio](https://cheerio.js.org/) — HTML parsing and modification
