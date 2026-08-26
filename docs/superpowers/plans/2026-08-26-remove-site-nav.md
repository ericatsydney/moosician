# Remove site navigation Implementation Plan

> **For agentic workers:** Execute this plan inline with test-first checks.

**Goal:** Remove the redundant same-page `site-nav` from the Moosician header.

**Architecture:** Keep the existing brand-only header. Delete the navigation markup and its dedicated CSS rules; no section IDs or interactive behavior change.

**Tech Stack:** Static HTML, CSS, Node.js test runner.

---

### Task 1: Add a regression check

**Files:**
- Create: `tests/header.test.js`

- [ ] Add a test that reads `components/header.html` and `assets/css/styles.css` and asserts neither contains `site-nav`.
- [ ] Run the test and confirm it fails against the current implementation.

### Task 2: Remove the navigation

**Files:**
- Modify: `components/header.html`
- Modify: `assets/css/styles.css`

- [ ] Delete the `<nav class="site-nav">` block from the header.
- [ ] Delete the base `.site-nav` rules and the mobile `.site-nav` override from the stylesheet.
- [ ] Run the regression test and the existing syntax checks.

### Task 3: Review the result

- [ ] Search the repository for stale `site-nav` references, excluding the design/plan documentation.
- [ ] Confirm the working tree contains only the intended implementation and test changes.
