# Dr. Bhagwat Singh Chouhan — Academic Website

Personal research website, served with GitHub Pages:
https://bhagwatsingh1111-meta.github.io/bhagwat-singh-website/

## Structure

```
index.html              All pages (Home, Research, Publications, Experience, Awards, Contact)
assets/css/style.css    Styles (light/dark theme colours are defined at the top)
assets/js/main.js       Page tabs, mobile menu, theme toggle, publication filters, image viewer
assets/img/             Photos and research figures
```

Each menu tab shows one page. Pages are the elements marked `data-view="..."` in `index.html`.

## Common updates

- **New paper:** copy an existing `<li class="card pub">` block in the *Journal articles* list, then change the year, title, authors and DOI. Add `data-first` if you are the first author.
- **News item:** add a new `<li>` at the top of the *Recent updates* list on the Home page.
- **New photo:** put it in `assets/img/` (ideally under 300 KB and at most 1600 px wide).

Changes pushed to `main` go live within a minute or two.
