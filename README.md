# LaTeX Abstract Cleaner

<p align="center">
  <strong>Source code for the GitHub Pages site that cleans LaTeX-heavy abstracts into plain text.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#project-structure">Project Structure</a>
</p>

---

## About This Website

This repository contains the source code for the GitHub Pages site at [ryokamoi.github.io/latex-abstract-cleaner/](https://ryokamoi.github.io/latex-abstract-cleaner/).

The website lets you paste an abstract, add custom Find/Replace rules, toggle cleanup options, and click **Clean Up** to produce plain text for reuse in arXiv, OpenReview, forms, notes, or similar places.

It runs entirely in the browser, with no backend, build step, or external dependency.

## Features

- Remove common LaTeX commands and formatting noise.
- Convert `\url{...}` into plain text.
- Collapse repeated whitespace and trim the result.
- Replace `---`, `~`, empty braces, and line breaks with cleaner text.
- Add custom Find/Replace rules for project-specific cleanup.
- Toggle detailed cleanup options on or off.
- Persist your custom rules and cleanup preferences in the browser.
- Copy the cleaned output with one click.

## Quick Start

1. Open `index.html` in a browser.
2. Paste the abstract, add rules if needed, and choose the cleanup options.
3. Click **Clean Up**, then copy the output.

## How It Works

Cleanup runs in a fixed order:

- custom Find/Replace rules
- em dash normalization
- comment removal
- LaTeX command stripping
- `\url{...}` unwrapping
- tilde-to-space conversion
- empty-brace removal
- line-break normalization
- whitespace collapsing
- final trim

Custom rules run before the built-in cleanup steps. Preferences are saved in cookies.

## Local Use

Open the site directly from disk:

```text
index.html
assets/app.js
assets/styles.css
```

Any static file server also works.

## Deployment

Deploy the repository root to GitHub Pages or any static host.

## Project Structure

```text
.
├── index.html
└── assets/
    ├── app.js
    ├── styles.css
    └── styles.scss
```

## Notes

- The app stores preferences in browser cookies, not on a server.
- The default custom replacement rule maps `\latex` to `LaTeX`.

## Repository

Source: [github.com/ryokamoi/latex_abstract_cleaner](https://github.com/ryokamoi/latex_abstract_cleaner)

If you want to contribute, start with `index.html` and the files under `assets/`.