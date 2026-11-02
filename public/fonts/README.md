# Public-site fonts

Self-hosted Latin variable WOFF2 files; no font download at build or runtime.

| File                                | Family / weights       |  Bytes | Source                                                                              |
| ----------------------------------- | ---------------------- | -----: | ----------------------------------------------------------------------------------- |
| cinzel-latin-variable.woff2         | Cinzel 600–700         | 25,904 | https://fonts.gstatic.com/s/cinzel/v26/8vIJ7ww63mVu7gt79mT7.woff2                   |
| jetbrains-mono-latin-variable.woff2 | JetBrains Mono 100–800 | 40,404 | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2 |

Combined payload: **66,308 bytes** (under the 120 KB limit). Retrieved 2026-11-02 from Google Fonts' Latin-subset CSS; neighboring OFL files retain each family's SIL Open Font License. Upstream license sources: `google/fonts` repository, `ofl/cinzel/OFL.txt` and `ofl/jetbrainsmono/OFL.txt`.

`app/layout.tsx` uses `next/font/local` with automatic fallback size-adjust metrics. Browser CLS still needs verification on the homepage and a doctrine chapter; file size and fallback metrics alone do not prove zero layout shift.
