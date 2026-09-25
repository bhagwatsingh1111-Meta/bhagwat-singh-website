# Dr. Bhagwat Singh Chouhan — Academic Website

Personal research website, served with GitHub Pages:
https://bhagwatsingh1111-meta.github.io/bhagwat-singh-website/

## Structure

```
index.html              Single-page site (all content lives here)
assets/css/style.css    Styles (light/dark theme colours are defined at the top)
assets/js/main.js       Mobile menu, theme toggle, publication filters, image viewer
assets/img/             Photos and research figures
assets/docs/            CV (PDF)
```

## Common updates

- **New paper:** copy an existing `<li class="card pub">` block in the *Journal articles* list in `index.html`, then change the year, title, authors and DOI. Add `data-first` if you are the first author.
- **News item:** add a new `<li>` at the top of the *Recent updates* list.
- **New CV:** replace `assets/docs/Bhagwat_Chouhan_CV.pdf`, keeping the same file name.
- **New photo:** put it in `assets/img/` (ideally under 300 KB and at most 1600 px wide). Then copy a `<figure>` in the *Gallery* section.

Changes pushed to `main` go live within a minute or two.
