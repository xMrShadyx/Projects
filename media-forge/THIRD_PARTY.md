# Third-party software

Media Forge uses these independently licensed components. Source, license and build information remain available at their official projects. Generated bundles retain upstream legal comments; the build also copies available dependency license files into `dist/licenses/`.

| Component | Version | License / source |
| --- | --- | --- |
| FFmpeg browser wrapper | 0.12.15 | MIT — https://github.com/ffmpegwasm/ffmpeg.wasm |
| FFmpeg single-thread WebAssembly core | 0.12.10 | GPL-2.0-or-later — https://github.com/ffmpegwasm/ffmpeg.wasm (core build scripts and source references); https://ffmpeg.org/legal.html |
| fflate | 0.8.3 | MIT — https://github.com/101arrowz/fflate |
| PDF-lib | 1.17.1 | MIT — https://github.com/Hopding/pdf-lib |
| PDF.js | 6.4.299 | Apache-2.0 — https://github.com/mozilla/pdf.js |
| fontkit for PDF-lib | 1.1.1 | MIT — https://github.com/Hopding/fontkit |
| Mammoth | 1.13.0 | BSD-2-Clause — https://github.com/mwilliamson/mammoth.js |
| docx | 9.15.0 | MIT — https://github.com/dolanmiu/docx |
| ExcelJS | 4.4.0 | MIT — https://github.com/exceljs/exceljs |
| PptxGenJS | 4.0.1 | MIT — https://github.com/gitbrent/PptxGenJS |
| JSZip | 3.10.1 | MIT or GPL-3.0-or-later — https://github.com/Stuk/jszip |
| Papa Parse | 5.5.3 | MIT — https://github.com/mholt/PapaParse |
| Noto Sans | Bundled regular font | SIL Open Font License; font and license in `public/` — https://github.com/notofonts/noto-fonts |

The FFmpeg wrapper and core have different licenses. The unmodified core is loaded from the official version-pinned npm distribution on jsDelivr. Its source/build information and upstream component licenses are maintained by FFmpeg.wasm and FFmpeg. Fonts used for interface styling are requested from Google Fonts; system fonts remain fallbacks.
