# Media Forge

A browser-based conversion workspace by ShadyCraft. An English interface, a searchable directory of 87 tool shortcuts, and 31 output extensions across video, audio, images, PDF, documents, spreadsheets and archives.

Files are processed on the user's device. There is no upload API, account system or server-side conversion service. The first FFmpeg conversion downloads a version-pinned WebAssembly engine from jsDelivr; the rest of the application and document libraries are served with the site. Media bytes stay in browser memory. Google Fonts receives font requests, not file contents.

## Try it

[Hosted demo](https://shady-media-forge.daredevil91138.chatgpt.site) — owner-private preview.

## Run locally

Requires Node.js 22 or newer and an internet connection for installation and the first FFmpeg engine download.

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:4198. For static hosting, publish `dist/` after building. Keep the `vendor/`, `chunks/`, font and license files together. Serve JavaScript modules with an appropriate MIME type. The single-thread FFmpeg core does not require cross-origin isolation headers.

## Interface

The header includes a two-column Convert PDF dropdown and a grouped All tools directory, with direct tool links and category shortcuts. Menus support keyboard navigation, Escape, outside-click dismissal and responsive scrolling in both themes. The home screen has a searchable card directory with category filters and descriptions. Selecting a tool opens its workspace. The default theme is light; the theme button switches to dark and stores the preference in browser-local storage. Existing conversion results stay in memory while navigating between tools.

## Conversion tools

| Tool | Inputs | Outputs and behavior |
| --- | --- | --- |
| Video to GIF | Supported video containers/codecs | Animated GIF; start, duration, palette quality, frame rate, dimensions, rotation, mirroring, grayscale, speed and looping |
| Video converter | MP4, MOV, WebM, MKV, AVI and other FFmpeg-compatible video | MP4, WebM, MOV, MKV, AVI; re-encoding, resize, trim, frame rate, speed and mute |
| Audio converter | Audio files or a video with an audio track | MP3, WAV, FLAC, OGG, M4A, AAC; trim, bitrate, sample rate, mono/stereo, volume and speed |
| Image converter | PNG, JPG, WebP, GIF, BMP, AVIF, TIFF, subject to decoder support | PNG, JPG, WebP, BMP, TIFF, ICO, still GIF; resize, rotation, mirroring, grayscale and relevant quality controls |
| Video to image | Video | One PNG, JPG or WebP frame at the selected timestamp |
| Edit PDF | Unlocked PDF | Preview one document at a time; add and position text/images, draw or handwrite a signature, change color/size, undo/redo, and save a separate copy. Existing text is unchanged; additions become transparent image overlays. Up to 200 pages and 25 MB |
| OCR | Printed scans in PDF, PNG, JPG, WebP or BMP | English, Bulgarian or both; searchable PDF with an image background and selectable text, or TXT. Up to 20 selected pages and 25 MB per file; review OCR accuracy |
| PDF tools | Unlocked PDF | Visual page thumbnails with drag reordering, rotation, removal and Undo; merge in queue order, split selected pages into ZIP, extract/remove/reorder pages, rotate, number, text watermark, crop visible bounds, flatten forms, optimize object streams, or raster-compress pages |
| From PDF | Unlocked PDF | Selectable text to TXT/DOCX; page images in a PPTX; PNG/JPG/WebP pages in ZIP; raster-embedded SVG pages in ZIP; page-number/text rows to XLSX/CSV |
| To PDF | Images, DOCX, TXT, Markdown, HTML, CSV, TSV, XLSX | Images embedded into individual PDFs; documents rebuilt from text; table values laid out as readable text |
| Image documents | Standard browser-decodable images | Embed an image in PDF, DOCX or XLSX, or wrap a raster image in SVG |
| Documents | DOCX, TXT, Markdown, HTML, ODT, EPUB, PPTX | Text-based DOCX, TXT, HTML, Markdown or PDF |
| Spreadsheets | XLSX, CSV, TSV, row-array/object-array JSON | XLSX, CSV, TSV, row-array JSON or text-based PDF |
| Archives | ZIP, uncompressed TAR or an individual file | ZIP ↔ TAR, or wrap an individual file in ZIP/TAR |

Catalog entries are convenient presets for these tools, not separate proprietary conversion engines. Each preset shows its preservation limits. For instance, Image to Excel embeds the image in a worksheet; it does not recognize table data.

## File management

- Drag and drop or choose multiple files; readable file cards with labelled Preview file, Edit PDF, Remove file and Move up/down actions. Removal affects only the list, with Undo for the latest single or bulk removal.
- Download individual results or a ZIP of all completed files.
- Preview browser-playable media. Document and archive results download directly.
- Completed results remain in memory until cleared, removed or the page is closed; they are not persisted to disk automatically. Result records retain their original File objects so comparisons still work after source rows are removed. The latest removed items stay available for Undo until another removal replaces them or the page closes.

## Practical limits

- Up to 12 files and 300 MB total per batch. Media: 150 MB/file. Documents/archives: 25 MB/file. Mobile memory limits may be lower.
- GIF: 0.1–30 seconds and width at most 1280 pixels. GIF conversion is intended for short clips.
- FFmpeg jobs have a three-minute execution timeout; smaller clips/resolutions work best.
- PDF editing: up to 200 pages; merging up to 200 total pages. Raster compression supports 50 pages and rebuilds pages as JPEGs, losing selectable text, links, annotations, forms and signatures. It can increase the size of text-only PDFs. Structural optimization does not downsample images and does not guarantee a size reduction. Cropping only changes the visible boundary and is not redaction.
- PDF export: up to 50 selected pages per job. Rendered pages are capped at 16 megapixels. Password-protected documents are unsupported. Printed scans can use the separate OCR tool.
- DOCX/PDF/HTML/ODT/EPUB/PPTX text conversions do not preserve original layout, pictures or styling. PDF-to-PPTX creates page-image slides. PDF-to-XLSX/CSV extracts text rows, not reconstructed tables. SVG output embeds a raster image rather than tracing vectors.
- Spreadsheet conversion uses the first or named worksheet. Formula results use cached values; formulas are not evaluated. Charts and formatting are not retained. Limit: 10,000 rows × 100 columns. CSV/TSV formula-like strings are escaped to reduce spreadsheet formula execution on opening.
- Archive containers are limited to 500 entries and 64 MB expanded data. Unsafe paths, encryption, ZIP64-sized archives and special TAR entry types are rejected. RAR, 7Z and compressed TAR are unsupported.
- HEIC, legacy DOC/XLS, DWG, DXF, CDR, EPS and other specialized proprietary formats are not advertised as working tools. Codec and browser support vary; corrupt or unsupported input reports an error.
- Animated images become still images in the image tools. Use Video to GIF for animation. Converting a lossy file to a lossless format cannot restore lost detail.

## Validation

```sh
npm test
node tests/make-fixtures.mjs
```

The fixture generator writes sample PDF, Word, spreadsheet, text, ODT, EPUB and ZIP files to `tests/fixtures/`. Browser testing is manual using the same real interface as users. See [VALIDATION.md](VALIDATION.md) for verified scenarios and limits.

## Ready-made settings and recovery

Balanced, Smaller file, Best quality and For email presets explain their tradeoffs and set actual encoding controls. Compact presets cap media dimensions without upscaling smaller inputs. GIF presets also set clip duration. Lossless formats do not claim lossy-quality savings, and email presets do not promise a particular attachment size. Manual edits switch the preset to Custom settings. PDF compression and image-export presets appear only where they apply.

Per-file errors explain likely causes and provide concrete recovery actions: retry just that file, choose a replacement/unlocked file, use smaller settings, review page/language settings, or open OCR for a printed scan. Rejected uploads and invalid settings remain visible until dismissed.

## OCR and PDF organization

Organize PDF opens one document at a time. Drag thumbnails or use labelled movement buttons; select pages for rotation/removal and undo changes. At least one page must remain. Exports preserve source page order as chosen and combine added rotations with original rotation. Copying pages may change form behavior and invalidate digital signatures.

OCR runs locally with Tesseract.js 7.0.0 and English/Bulgarian 1.0.0 language data. Worker code, WebAssembly core and language data are served from the site on demand. Recognition handles printed scans, not reliable handwriting transcription or table reconstruction. Searchable PDFs rebuild selected pages as images plus a text layer, losing original links, forms and digital signatures. TXT results can be reviewed/copied in Preview; PDF previews also expose selectable page text. Cancel terminates the OCR worker while keeping previous downloads. Scans must be upright and clear; review output for recognition mistakes.

## Preview & compare

Preview original PDFs, common browser image formats, video and audio before processing. Results include original/output byte sizes and honest growth or reduction labels. PDF comparisons show original and result side by side with independent page navigation; merged PDFs let you choose the original to compare. Images use a keyboard-accessible before/after slider. Video/audio have native playback controls; GIF results animate in the browser. Unsupported formats/codecs show a fallback instead of claiming playback support. File bytes stay local; viewer object URLs and PDF rendering tasks are released when the preview closes.

## Architecture

Original files and finished downloads have independent lists. Conversion never replaces an original. Results stay available when originals are removed, and the same originals can be converted again. Processing has a visible spinner/progress panel and a persistent completion message; each finished file has its own Download button.

- `src/app.js`: interface, queue, conversion lifecycle and downloads.
- `src/results.mjs`: independent result snapshots, original references and aggregate progress.
- `src/preview.js` and `src/preview-model.mjs`: local previews, side-by-side PDF views, image comparison and file-size summaries.
- `src/model.mjs`: media settings, validation and FFmpeg argument generation.
- `src/page-organizer.js` and `src/page-layout.mjs`: thumbnail organization and rotation-aware page export.
- `src/presets.mjs` and `src/error-help.mjs`: honest preset settings and error recovery guidance.
- `src/ocr.js`: local printed-text recognition and searchable PDF/TXT output.
- `src/pdf-editor.js` and `src/pdf-overlay.mjs`: local visual additions, page preview and rotation-aware overlay export.
- `src/pdf-tools.mjs`: lossless PDF page operations, numbering, watermarking and form flattening.
- `src/catalog.js`: searchable conversion presets and honest capability descriptions.
- `src/files.js`: lazily loaded PDF, document, spreadsheet and archive engines.
- `src/file-model.mjs`: file routing, bounded page ranges and archive path checks.
- `public/`: responsive English interface, styles and the open-source Noto Sans font.
- `build.mjs`: bundles application modules and copies versioned worker/font assets.

No credentials, user media, conversion history or generated fixtures are part of the source project. Third-party libraries retain their licenses; see [THIRD_PARTY.md](THIRD_PARTY.md).
