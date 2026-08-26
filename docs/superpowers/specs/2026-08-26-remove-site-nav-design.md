# Remove desktop site navigation

## Goal

Remove the redundant `site-nav` from the single-page Moosician website.

## Design

- Delete the primary navigation element and its three same-page anchor links from `components/header.html`.
- Delete the unused `.site-nav` styling and the mobile-only `.site-nav` override from `assets/css/styles.css`.
- Preserve the brand link, header spacing, responsive layout, and all page section IDs used by other behavior.

## Verification

- Confirm no `site-nav` references remain outside this design document.
- Run the existing syntax or smoke checks if available.
- Inspect the resulting header markup for valid structure.
