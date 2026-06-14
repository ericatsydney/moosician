# Moosucian UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the app to Moosucian, simplify the landing hero, remove the practice-mode panel, standardize tempo labels on BPM, and reduce each transport control to a single toggle button.

**Architecture:** Keep the page shell and widget layout intact, but trim the hero to a concise slogan/info block and let each player manage its own start/stop state with one button. Update the shared header/footer copy so the visible app identity is consistent everywhere, and refresh the tests to reflect the new control model.

**Tech Stack:** Static HTML fragments, vanilla JavaScript, CSS, browser smoke tests.

---

### Task 1: Refresh app identity and hero copy

**Files:**
- Modify: `index.html`
- Modify: `components/header.html`
- Modify: `components/footer.html`
- Modify: `components/main.html`
- Modify: `assets/css/styles.css`
- Modify: `README.md`

- [ ] **Step 1: Update the visible app name and title text**

```html
<!-- index.html -->
<title>Moosucian</title>

<!-- components/header.html -->
<a class="brand" href="./" aria-label="Moosucian home">
  <span class="brand-mark" aria-hidden="true">M</span>
  <span class="brand-copy">
    <strong>Moosucian</strong>
    <small>Practice console</small>
  </span>
</a>

<!-- components/footer.html -->
<footer class="site-footer">
  <span>&copy; 2026 Moosucian</span>
  <span>Built for focused practice, quick ideas, and clean tempo work.</span>
</footer>
```

- [ ] **Step 2: Replace the hero with a shorter slogan and key info only**

```html
<!-- components/main.html -->
<section class="hero" id="practice" aria-labelledby="page-title">
  <div class="hero-content">
    <p class="eyebrow">Guitar and music tools</p>
    <h1 id="page-title">Keep the pulse clear and the ideas moving.</h1>
    <p class="hero-copy">
      Moosucian keeps tempo work, strumming, and quick notes in one focused place.
    </p>
    <dl class="hero-stats" aria-label="Workspace highlights">
      <div>
        <dt>Tempo range</dt>
        <dd>30-300 BPM</dd>
      </div>
      <div>
        <dt>Beat feel</dt>
        <dd>4/4 accents</dd>
      </div>
      <div>
        <dt>State</dt>
        <dd>Saved locally</dd>
      </div>
    </dl>
  </div>
</section>
```

- [ ] **Step 3: Simplify the hero CSS to match the single-column layout**

```css
/* assets/css/styles.css */
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: stretch;
  padding: 28px 0 12px;
}

.hero-content {
  padding: 18px 0 10px;
}

.hero h1 {
  max-width: 12ch;
  font-size: clamp(2.6rem, 5.4vw, 4.8rem);
  line-height: 0.92;
}
```

- [ ] **Step 4: Update the README name and overview copy**

```md
# Moosucian

A small music utility page for guitar and songwriting workflows.
```

- [ ] **Step 5: Verify the new branding appears in the rendered page**

Run: `node tests/run-test.js`
Expected: existing tests still execute after the branding text updates.

### Task 2: Convert transport controls to single-button toggles and standardize BPM labels

**Files:**
- Modify: `components/main.html`
- Modify: `assets/js/metronome.js`
- Modify: `assets/js/strummer.js`
- Modify: `assets/css/metronome.css`

- [ ] **Step 1: Replace the metronome Start/Stop pair with one toggle button**

```html
<!-- components/main.html -->
<div class="buttons">
  <button id="metronome-toggle" class="btn primary">Start</button>
  <button id="metronome-mute" class="btn" aria-pressed="false">Mute</button>
  <button id="metronome-tap" class="btn secondary">Tap tempo</button>
</div>
<div class="tap-panel">
  <span class="tap-display">Average: <strong id="metronome-tap-value">--</strong> BPM</span>
</div>
```

- [ ] **Step 2: Update the metronome script to flip the same button text and state**

```javascript
// assets/js/metronome.js
const toggleBtn = document.getElementById('metronome-toggle');
// ...
function start() {
  if (isRunning) return;
  // ...
  toggleBtn.textContent = 'Stop';
}

function stop() {
  if (!isRunning) return;
  // ...
  toggleBtn.textContent = 'Start';
}

toggleBtn.addEventListener('click', () => {
  if (isRunning) stop();
  else start();
});
statusLive.textContent = `Tap tempo: ${bpm} BPM`;
```

- [ ] **Step 3: Rename all metronome RPM copy to BPM**

```javascript
// assets/js/metronome.js
function clampBPM(v){ return Math.max(30, Math.min(300, Math.round(v||120))); }
// keep localStorage key as metronome-bpm
```

- [ ] **Step 4: Replace the strummer Start/Stop pair with one toggle button**

```html
<!-- components/main.html -->
<div class="buttons">
  <button id="strum-toggle" class="btn primary">Start</button>
</div>
```

```javascript
// assets/js/strummer.js
const toggleBtn = document.getElementById("strum-toggle");
function start() {
  if (isRunning) return;
  // ...
  toggleBtn.textContent = "Stop";
}
function stop() {
  if (!isRunning) return;
  // ...
  toggleBtn.textContent = "Start";
}
toggleBtn.addEventListener("click", function(){
  if (isRunning) stop();
  else start();
});
```

- [ ] **Step 5: Remove obsolete stop-button styling assumptions**

```css
/* assets/css/metronome.css */
.buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}
```

- [ ] **Step 6: Verify the widgets still start and stop from a single control**

Run: `node tests/run-test.js`
Expected: the metronome and strummer tests pass with the new button model.

### Task 3: Update automated tests to the new markup and labels

**Files:**
- Modify: `tests/metronome.test.js`
- Modify: `tests/strummer.test.js`

- [ ] **Step 1: Update the metronome smoke test to use the toggle button and BPM labels**

```javascript
const toggleBtn = document.getElementById('metronome-toggle');
assert(toggleBtn !== null, 'Toggle button should exist');
assert(toggleBtn.disabled === false, 'Toggle button should be enabled initially');

toggleBtn.click();
await wait(120);
assert(toggleBtn.textContent === 'Stop', 'Toggle button should show Stop after starting');

toggleBtn.click();
await wait(120);
assert(toggleBtn.textContent === 'Start', 'Toggle button should show Start after stopping');
```

- [ ] **Step 2: Update the strummer smoke test to use the toggle button**

```javascript
const toggleBtn = document.getElementById("strum-toggle");
assert(!!toggleBtn, "Toggle button should exist");
toggleBtn.click();
toggleBtn.click();
```

- [ ] **Step 3: Run the test suite and confirm all smoke checks pass**

Run: `node tests/run-test.js`
Expected: exit code `0` with all tests passing.

