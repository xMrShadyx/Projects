# Validation

Verified on 2026-10-30 in the Codex in-app browser using generated media and document fixtures. This is sample-based validation, not a guarantee for every codec or input combination.

## Automated checks

- 19 tests pass: numeric bounds, GIF limits, codec command generation, audio stream selection, lossless bitrate behavior, playback timing, muting, GIF palettes, frame timestamps, file routing, filename cleanup, PDF page ranges and archive path checks.
- Production dependency audit reports zero known vulnerabilities at verification time.
- Static application build succeeds.

## Browser conversions

- MP4 → animated GIF; downloaded GIF inspected with FFprobe and confirmed to be a valid GIF at the selected dimensions.
- MP4 → MP4, WebM, MOV, MKV and AVI.
- MP4 → MP3 audio extraction. WAV → WAV, FLAC, OGG, M4A and AAC.
- PNG → PNG, JPEG, WebP, BMP, TIFF, ICO and still GIF.
- Video → PNG, JPEG and WebP still frames.
- PDF → DOCX, TXT, page-image PPTX, PNG/JPEG/WebP/SVG page ZIPs, XLSX text rows and CSV text rows.
- DOCX, TXT (including Bulgarian text), HTML, Markdown, CSV, XLSX and PNG → PDF.
- ODT, EPUB and HTML → DOCX text documents.
- CSV → XLSX; XLSX → CSV/JSON/TSV; JSON → XLSX; TSV → CSV.
- PNG → DOCX/XLSX embedded image and raster-embedded SVG.
- ZIP → TAR → ZIP roundtrip. TAR and ZIP inspected independently; filenames and file contents preserved.
- ZIP download generated successfully and checked independently for integrity.

## Interaction checks

- Corrupt video reports an individual error while the next valid file in the batch completes.
- Cancel interrupts the engine; a subsequent conversion reloads it and succeeds.
- Keyboard controls, file picker, multiple selection, removal, clearing and output format selection work.
- Desktop and narrow-screen layouts inspected. Temporary viewport overrides reset after QA.

## Limits of verification

Real-world PDFs, spreadsheets, codecs and mobile memory conditions vary. No OCR, layout reconstruction, proprietary CAD conversion, RAR writing, HEIC decoding or server-side processing is claimed. Browser playback of a converted container depends on browser codecs; a successful download can still need an external player.

## Light/dark redesign and PDF tools

- Default light theme; switching to dark persists across reloads. Light and dark home/workspace layouts inspected.
- Search filters cards; choosing a card opens its workspace; All tools returns to the directory.
- Browser-verified PDF merge, split, extract, remove, reorder, rotation, page numbers, text watermark, crop, form flattening, structural optimization and raster compression.
- Merge test reordered two inputs: the downloaded PDF has three pages and the expected first-page width, independently confirmed with PDF-lib.
- Raster compression sample: an image-heavy PDF decreased from about 2 MB to about 75 KB. This is a sample result, not a general compression guarantee.
- Seven additional automated PDF tests verify page order/count, split ZIP contents, selected rotations/crop bounds, form field removal, readable outputs and invalid-request/cancellation rejection.

The catalog now includes 84 shortcuts. A narrow 390 px viewport showed no horizontal page overflow. PNG-to-JPEG conversion still succeeds after the navigation redesign.

## Header dropdown menus

Convert PDF and All tools were verified in the browser: direct tool selection, category shortcuts, one open menu at a time, ArrowDown to open/focus, Escape to close/restore focus, outside-click dismissal, dark theme, and narrow-screen layout.

## Separate originals and results

- Browser merge of three PDFs retained all three original names and created one separate result. The downloaded PDF was independently read with PDF-lib and contained four pages.
- Processing displayed a spinner/status panel; completion displayed a persistent success panel and a prominent Download PDF link.
- Repeating the merge created a second independent result. Removing an original retained both results; clearing results retained originals; clearing originals retained a finished result.
- Four additional automated tests cover immutable source attribution, repeated conversion, actual output formats and bounded aggregate progress. All 23 automated tests pass.

## Visual PDF editor

- Added Edit PDF to the catalog, PDF action selector and All tools dropdown. Documents are opened individually, including via a row's Edit PDF button.
- Browser-verified text content/size/position updates, image insertion and resizing, page navigation, freehand signature, element deletion, Undo/Redo, save and download. A two-page exported PDF was independently rendered with PyMuPDF: text, image and signature were present, and original selectable text remained extractable.
- Cropped four-page fixture with 0/90/180/270 degree rotations: added labels remained at the displayed top-left on each page after saving. Independent raster bounds matched 10% positions, while page rotations and original text were preserved.
- Light and dark previews checked. A 390 px viewport had no horizontal dialog overflow; saving from the narrow layout succeeded.
- Three automated overlay tests cover rotated crop geometry, source immutability, output page preservation, invalid edits and cancellation. All 26 automated tests pass.
- Additions are flattened raster overlays, not edits to existing text or a redaction mechanism. Drawn signatures are not certificate-based digital signatures. Existing digital signatures are not preserved. Editing sessions live only in memory and are discarded when closed; saved results remain until cleared or the page is closed.
