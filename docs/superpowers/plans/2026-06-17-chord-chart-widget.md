# Chord Chart Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a chord chart widget with 42 chords (7 roots x 6 variants), root/variant button selectors, and inline SVG fretboard diagrams.

**Architecture:** Three new files (chord data, widget JS, widget CSS) plus modifications to main.html, index.html, and styles.css. Widget follows existing IIFE pattern with MutationObserver-based DOM ready detection. SVG rendering is a pure function producing an SVG string injected via innerHTML.

**Tech Stack:** Vanilla JS (IIFE), CSS custom properties, inline SVG, standard guitar chord voicings.

---

### Task 1: Create chord data file with all 42 voicings

**Files:**
- Create: `assets/js/chords.js`

- [ ] **Step 1: Write the chord data module**

```js
// Chord voicing data — 42 chords (7 roots x 6 variants)
// Each entry: strings[6] low-E to high-e: 0=open, -1=muted, fret number
// barres: optional array of { fromString(0-5), toString(0-5), fret }
;(function(){
  const CHORDS = {
    // C family
    "C-maj":    { name: "C",     strings: [-1, 3, 2, 0, 1, 0] },
    "C-m":      { name: "Cm",    strings: [-1, 3, 5, 5, 4, 3], barres: [{ fromString: 1, toString: 4, fret: 3 }] },
    "C-7":      { name: "C7",    strings: [-1, 3, 2, 3, 1, 0] },
    "C-maj7":   { name: "Cmaj7", strings: [-1, 3, 2, 0, 0, 0] },
    "C-m7":     { name: "Cm7",   strings: [-1, 3, 5, 3, 4, 3], barres: [{ fromString: 1, toString: 4, fret: 3 }] },
    "C-sus4":   { name: "Csus4", strings: [-1, 3, 3, 0, 1, 1] },

    // D family
    "D-maj":    { name: "D",     strings: [-1, -1, 0, 2, 3, 2] },
    "D-m":      { name: "Dm",    strings: [-1, -1, 0, 2, 3, 1] },
    "D-7":      { name: "D7",    strings: [-1, -1, 0, 2, 1, 2] },
    "D-maj7":   { name: "Dmaj7", strings: [-1, -1, 0, 2, 2, 2] },
    "D-m7":     { name: "Dm7",   strings: [-1, -1, 0, 2, 1, 1] },
    "D-sus4":   { name: "Dsus4", strings: [-1, -1, 0, 2, 3, 3] },

    // E family
    "E-maj":    { name: "E",     strings: [0, 2, 2, 1, 0, 0] },
    "E-m":      { name: "Em",    strings: [0, 2, 2, 0, 0, 0] },
    "E-7":      { name: "E7",    strings: [0, 2, 0, 1, 0, 0] },
    "E-maj7":   { name: "Emaj7", strings: [0, 2, 1, 1, 0, 0] },
    "E-m7":     { name: "Em7",   strings: [0, 2, 0, 0, 0, 0] },
    "E-sus4":   { name: "Esus4", strings: [0, 2, 2, 2, 0, 0] },

    // F family
    "F-maj":    { name: "F",     strings: [1, 3, 3, 2, 1, 1], barres: [{ fromString: 0, toString: 5, fret: 1 }] },
    "F-m":      { name: "Fm",    strings: [1, 3, 3, 1, 1, 1], barres: [{ fromString: 0, toString: 5, fret: 1 }] },
    "F-7":      { name: "F7",    strings: [1, 3, 1, 2, 1, 1], barres: [{ fromString: 0, toString: 5, fret: 1 }] },
    "F-maj7":   { name: "Fmaj7", strings: [-1, -1, 3, 2, 1, 0] },
    "F-m7":     { name: "Fm7",   strings: [1, 3, 1, 1, 1, 1], barres: [{ fromString: 0, toString: 5, fret: 1 }] },
    "F-sus4":   { name: "Fsus4", strings: [1, 3, 3, 3, 1, 1], barres: [{ fromString: 0, toString: 5, fret: 1 }] },

    // G family
    "G-maj":    { name: "G",     strings: [3, 2, 0, 0, 0, 3] },
    "G-m":      { name: "Gm",    strings: [3, 5, 5, 3, 3, 3], barres: [{ fromString: 0, toString: 5, fret: 3 }] },
    "G-7":      { name: "G7",    strings: [3, 2, 0, 0, 0, 1] },
    "G-maj7":   { name: "Gmaj7", strings: [3, 2, 0, 0, 0, 2] },
    "G-m7":     { name: "Gm7",   strings: [3, 5, 3, 3, 3, 3], barres: [{ fromString: 0, toString: 5, fret: 3 }] },
    "G-sus4":   { name: "Gsus4", strings: [3, 3, 0, 0, 1, 3] },

    // A family
    "A-maj":    { name: "A",     strings: [-1, 0, 2, 2, 2, 0] },
    "A-m":      { name: "Am",    strings: [-1, 0, 2, 2, 1, 0] },
    "A-7":      { name: "A7",    strings: [-1, 0, 2, 0, 2, 0] },
    "A-maj7":   { name: "Amaj7", strings: [-1, 0, 2, 1, 2, 0] },
    "A-m7":     { name: "Am7",   strings: [-1, 0, 2, 0, 1, 0] },
    "A-sus4":   { name: "Asus4", strings: [-1, 0, 2, 2, 3, 0] },

    // B family
    "B-maj":    { name: "B",     strings: [-1, 2, 4, 4, 4, 2], barres: [{ fromString: 1, toString: 4, fret: 2 }] },
    "B-m":      { name: "Bm",    strings: [-1, 2, 4, 4, 3, 2], barres: [{ fromString: 1, toString: 4, fret: 2 }] },
    "B-7":      { name: "B7",    strings: [-1, 2, 1, 2, 0, 2] },
    "B-maj7":   { name: "Bmaj7", strings: [-1, 2, 4, 3, 4, 2] },
    "B-m7":     { name: "Bm7",   strings: [-1, 2, 0, 2, 0, 2] },
    "B-sus4":   { name: "Bsus4", strings: [-1, 2, 4, 4, 5, 2] }
  };

  window.CHORD_DATA = CHORDS;
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/chords.js
git commit -m "feat: add chord voicing data for 42 chords"
```

---

### Task 2: Create chord-chart.css with widget styles

**Files:**
- Create: `assets/css/chord-chart.css`

- [ ] **Step 1: Write the stylesheet**

```css
/* Chord chart widget styles */

.chord-chart {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.chord-card {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  overflow: hidden;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(15, 23, 39, 0.96), rgba(9, 15, 28, 0.98)),
    rgba(21, 27, 35, 0.96);
  color: var(--text);
  box-shadow: var(--shadow);
}

.chord-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(114, 244, 209, 0.08), transparent 30%),
    linear-gradient(315deg, rgba(72, 207, 255, 0.06), transparent 28%);
  pointer-events: none;
}

.chord-selectors {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.chord-roots,
.chord-variants {
  display: flex;
  gap: 4px;
}

.chord-roots {
  padding-right: 8px;
  border-right: 1px solid var(--line);
}

.chord-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 32px;
  padding: 0.32rem 0.56rem;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--muted);
  cursor: pointer;
  font-family: var(--body);
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}

.chord-btn:hover {
  border-color: rgba(114, 244, 209, 0.24);
  color: var(--text);
}

.chord-btn.active {
  border-color: rgba(114, 244, 209, 0.42);
  background: rgba(114, 244, 209, 0.12);
  color: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(114, 244, 209, 0.08);
}

.chord-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 160px;
}

.chord-svg {
  display: block;
  width: 240px;
  height: auto;
}

.chord-label {
  text-align: center;
  margin: 4px 0 0;
  font-family: var(--display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent);
}

.chord-error {
  text-align: center;
  color: var(--muted);
  padding: 20px 0;
}

@media (max-width: 760px) {
  .chord-card {
    padding: 18px;
  }
  .chord-svg {
    width: 200px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/chord-chart.css
git commit -m "feat: add chord chart widget styles"
```

---

### Task 3: Create chord-chart.js widget with SVG renderer

**Files:**
- Create: `assets/js/chord-chart.js`

- [ ] **Step 1: Write the widget JS**

```js
// Chord chart widget — select root/variant, view SVG fretboard diagram
;(function(){
  const ROOTS = ["C","D","E","F","G","A","B"];
  const VARIANTS = ["maj","m","7","maj7","m7","sus4"];

  var currentRoot = "C";
  var currentVariant = "maj";

  function renderChord(chordData){
    if(!chordData) return '<div class="chord-error">Chord not available</div>';

    const strings = chordData.strings;
    const barres = chordData.barres || [];
    const W = 240;
    const PAD_LEFT = 32;
    const PAD_TOP = 22;
    const PAD_RIGHT = 16;
    const PAD_BOTTOM = 8;
    const STRING_SPACING = (W - PAD_LEFT - PAD_RIGHT) / 5;
    const FRET_HEIGHT = 36;
    const FRET_COUNT = 3;

    // Compute startFret: minimum non-zero fretted position, at least 1
    const fretted = strings.filter(function(v){ return v > 0; });
    const startFret = fretted.length ? Math.max(1, Math.min.apply(null, fretted)) : 1;
    const showFretLabel = startFret > 1;

    // Total height
    const H = PAD_TOP + FRET_HEIGHT * FRET_COUNT + PAD_BOTTOM + 14;

    function x(s){ return PAD_LEFT + s * STRING_SPACING; }
    function y(f){ return PAD_TOP + (f - 1) * FRET_HEIGHT + FRET_HEIGHT / 2; } // f is 1-based relative to startFret

    var parts = [];

    // SVG open
    parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" class="chord-svg" aria-label="' + chordData.name + ' chord diagram">');

    // Definitions
    parts.push('<defs><style>.dot { fill: #72f4d1; } .barre-line { fill: none; stroke: #72f4d1; stroke-width: 6; stroke-linecap: round; opacity: 0.7; } .str-line { stroke: rgba(167,182,214,0.3); stroke-width: 1; } .fret-line { stroke: rgba(167,182,214,0.4); stroke-width: 1; } .nut-line { stroke: rgba(167,182,214,0.7); stroke-width: 3; } .fret-label { fill: #a8b3c9; font-family: system-ui, sans-serif; font-size: 10px; text-anchor: middle; } .marker { fill: #a8b3c9; font-family: system-ui, sans-serif; font-size: 11px; text-anchor: middle; }</style></defs>');

    // String markers (X/O above nut)
    for(var s = 0; s < 6; s++){
      if(strings[s] === -1){
        parts.push('<text x="' + x(s) + '" y="' + (PAD_TOP - 10) + '" class="marker">X</text>');
      } else if(strings[s] === 0){
        parts.push('<text x="' + x(s) + '" y="' + (PAD_TOP - 10) + '" class="marker">O</text>');
      }
    }

    // Vertical string lines
    for(var s = 0; s < 6; s++){
      parts.push('<line x1="' + x(s) + '" y1="' + PAD_TOP + '" x2="' + x(s) + '" y2="' + (PAD_TOP + FRET_HEIGHT * FRET_COUNT) + '" class="str-line" />');
    }

    // Horizontal fret lines
    for(var f = 0; f <= FRET_COUNT; f++){
      var fy = PAD_TOP + f * FRET_HEIGHT;
      if(f === 0){
        if(showFretLabel){
          // Thin line + fret number label
          parts.push('<line x1="' + x(0) + '" y1="' + fy + '" x2="' + x(5) + '" y2="' + fy + '" class="fret-line" />');
          parts.push('<text x="' + (x(0) - 14) + '" y="' + (fy + FRET_HEIGHT / 2 - 4) + '" class="fret-label">' + startFret + 'fr</text>');
        } else {
          // Thick nut line
          parts.push('<line x1="' + x(0) + '" y1="' + fy + '" x2="' + x(5) + '" y2="' + fy + '" class="nut-line" />');
        }
      } else {
        parts.push('<line x1="' + x(0) + '" y1="' + fy + '" x2="' + x(5) + '" y2="' + fy + '" class="fret-line" />');
      }
    }

    // Barre arcs (behind dots)
    for(var b = 0; b < barres.length; b++){
      var barre = barres[b];
      var fretRel = barre.fret - startFret + 1;
      if(fretRel < 1 || fretRel > FRET_COUNT) continue;
      var fromX = x(barre.fromString);
      var toX = x(barre.toString);
      var barreY = PAD_TOP + (fretRel - 1) * FRET_HEIGHT + FRET_HEIGHT / 2;
      var arcY = barreY - 8; // slight lift above the fret line
      parts.push('<path d="M' + fromX + ' ' + arcY + ' Q' + ((fromX+toX)/2) + ' ' + (arcY-6) + ' ' + toX + ' ' + arcY + '" class="barre-line" />');
    }

    // Fingering dots
    for(var s = 0; s < 6; s++){
      var fretVal = strings[s];
      if(fretVal <= 0) continue;
      var fretRel = fretVal - startFret + 1;
      if(fretRel < 1 || fretRel > FRET_COUNT) continue;
      parts.push('<circle cx="' + x(s) + '" cy="' + (PAD_TOP + (fretRel - 1) * FRET_HEIGHT + FRET_HEIGHT / 2) + '" r="7" class="dot" />');
    }

    parts.push('</svg>');
    return parts.join("");
  }

  function updateChord(){
    var key = currentRoot + "-" + currentVariant;
    var chordData = window.CHORD_DATA ? window.CHORD_DATA[key] : null;
    var diagram = document.querySelector(".chord-diagram");
    var label = document.querySelector(".chord-label");
    if(diagram) diagram.innerHTML = renderChord(chordData);
    if(label) label.textContent = chordData ? chordData.name : currentRoot + currentVariant;
  }

  function setActiveRoot(root){
    document.querySelectorAll(".chord-roots .chord-btn").forEach(function(btn){
      btn.classList.toggle("active", btn.dataset.root === root);
    });
  }

  function setActiveVariant(variant){
    document.querySelectorAll(".chord-variants .chord-btn").forEach(function(btn){
      btn.classList.toggle("active", btn.dataset.variant === variant);
    });
  }

  function bindAndInit(){
    var rootContainer = document.querySelector(".chord-roots");
    var variantContainer = document.querySelector(".chord-variants");
    if(!rootContainer || !variantContainer) return;

    // Build root buttons
    ROOTS.forEach(function(root){
      var btn = document.createElement("button");
      btn.className = "chord-btn";
      btn.dataset.root = root;
      btn.textContent = root;
      btn.setAttribute("aria-pressed", root === "C" ? "true" : "false");
      btn.addEventListener("click", function(){
        currentRoot = root;
        setActiveRoot(root);
        updateChord();
        document.querySelectorAll(".chord-roots .chord-btn").forEach(function(b){
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
      });
      rootContainer.appendChild(btn);
    });

    // Build variant buttons
    VARIANTS.forEach(function(variant){
      var btn = document.createElement("button");
      btn.className = "chord-btn";
      btn.dataset.variant = variant;
      btn.textContent = variant;
      btn.setAttribute("aria-pressed", variant === "maj" ? "true" : "false");
      btn.addEventListener("click", function(){
        currentVariant = variant;
        setActiveVariant(variant);
        updateChord();
        document.querySelectorAll(".chord-variants .chord-btn").forEach(function(b){
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
      });
      variantContainer.appendChild(btn);
    });

    // Set initial active state
    setActiveRoot("C");
    setActiveVariant("maj");

    // Render initial chord (default: C major)
    updateChord();
  }

  function waitForAppReady(){
    if(document.body && document.body.dataset && document.body.dataset.ready === "true"){
      bindAndInit();
      return;
    }
    var obs = new MutationObserver(function(mutations){
      for(var i = 0; i < mutations.length; i++){
        if(mutations[i].type === "attributes" && mutations[i].attributeName === "data-ready"){
          if(document.body.dataset.ready === "true"){
            obs.disconnect();
            bindAndInit();
            return;
          }
        }
      }
    });
    if(document.body){
      obs.observe(document.body, { attributes: true, attributeFilter: ["data-ready"] });
    }
    window.addEventListener("load", function(){
      if(!document.body.dataset || document.body.dataset.ready !== "true") bindAndInit();
    }, { once: true });
  }

  waitForAppReady();
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/chord-chart.js
git commit -m "feat: add chord chart widget with SVG renderer"
```

---

### Task 4: Add widget HTML to main.html

**Files:**
- Modify: `components/main.html`

- [ ] **Step 1: Insert chord chart card after strummer card**

Add the chord chart widget card inside `.workspace-grid` after the strummer `</div>` closing `</section>` and before the closing `</section>` of `.workspace-grid`:

```html
  <!-- Chord Chart -->
  <div class="widget-card" id="chord-card">
    <section class="chord-chart widget-module" role="region" aria-labelledby="chord-title">
      <h2 id="chord-title" class="widget-title">Chord Chart</h2>
      <p class="widget-subtitle">Choose a root and variant to see the fingering</p>
      <div class="chord-card">
        <div class="chord-selectors">
          <div class="chord-roots" role="group" aria-label="Root note"></div>
          <div class="chord-variants" role="group" aria-label="Chord variant"></div>
        </div>
        <div class="chord-diagram"></div>
        <p class="chord-label" aria-live="polite">C</p>
      </div>
    </section>
  </div>
```

Insert it just before `</section>` (the closing tag of `.workspace-grid`).

- [ ] **Step 2: Verify the file structure**

The `.workspace-grid` section should now contain three `.widget-card` divs: metronome, strummer, chord chart.

- [ ] **Step 3: Commit**

```bash
git add components/main.html
git commit -m "feat: add chord chart widget card to main layout"
```

---

### Task 5: Add CSS and JS includes to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add CSS link and JS scripts**

Add the chord chart CSS and JS includes. The CSS link goes after `strummer.css` in `<head>`. The JS scripts go after `strummer.js`:

```html
    <link rel="stylesheet" href="assets/css/chord-chart.css">
```
(add after the strummer.css link)

```html
    <script src="assets/js/chords.js" defer></script>
    <script src="assets/js/chord-chart.js" defer></script>
```
(add after the strummer.js script, before strummer.js since chords data is needed)

The final order of scripts:
```html
    <script src="assets/js/app.js" defer></script>
    <script src="assets/js/metronome.js" defer></script>
    <script src="assets/js/strummer.js" defer></script>
    <script src="assets/js/chords.js" defer></script>
    <script src="assets/js/chord-chart.js" defer></script>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: include chord chart CSS and JS in index.html"
```

---

### Task 6: Update workspace-grid for 3-column layout

**Files:**
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Add 3-column breakpoint**

Add a media query for ≥960px to make `.workspace-grid` 3-column:

```css
@media (min-width: 960px) {
  .workspace-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

This should be added after the existing `.workspace-grid` rule (which defaults to `1fr 1fr`) and before the existing `@media (max-width: 760px)` block.

- [ ] **Step 2: Commit**

```bash
git add assets/css/styles.css
git commit -m "feat: 3-column workspace-grid at >= 960px for chord chart"
```

---

### Task 7: Smoke test

**Files:**
- Create: `tests/chord-chart-smoke.html`

- [ ] **Step 1: Write the smoke test page**

Create a standalone test page that includes the chord chart widget plus the metronome (needed because strummer references metronome BPM input) to verify everything works:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Chord Chart Smoke Test</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/metronome.css">
    <link rel="stylesheet" href="../assets/css/strummer.css">
    <link rel="stylesheet" href="../assets/css/chord-chart.css">
    <style>
      body { margin: 0; padding: 2rem; min-height: 100vh; background: #071018; color: #f2f5f8; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      h1 { margin: 0 0 1rem; font-size: 1.7rem; }
      #test-report { margin-bottom: 1.5rem; }
      .test-line { margin: 0.25rem 0; }
      .test-pass { color: #7dd3fc; }
      .test-fail { color: #f87171; }
      .test-summary { margin-top: 1.25rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); }
      .test-fixture { max-width: 520px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Chord Chart Smoke Test</h1>
      <div id="test-report" aria-live="polite"></div>
      <div id="test-summary" class="test-summary" aria-live="polite">Running smoke tests...</div>
      <section class="test-fixture">
        <!-- Chord chart fixture -->
        <section class="chord-chart widget-module" role="region" aria-labelledby="chord-title">
          <h2 id="chord-title" class="widget-title">Chord Chart</h2>
          <p class="widget-subtitle">Choose a root and variant to see the fingering</p>
          <div class="chord-card">
            <div class="chord-selectors">
              <div class="chord-roots" role="group" aria-label="Root note"></div>
              <div class="chord-variants" role="group" aria-label="Chord variant"></div>
            </div>
            <div class="chord-diagram"></div>
            <p class="chord-label" aria-live="polite">C</p>
          </div>
        </section>
      </section>
    </main>
    <script src="../assets/js/chords.js"></script>
    <script src="../assets/js/chord-chart.js"></script>
    <script>
      ;(function(){
        var report = document.getElementById("test-report");
        var summary = document.getElementById("test-summary");
        var passCount = 0;
        var failCount = 0;

        function pass(msg){
          passCount++;
          var el = document.createElement("div");
          el.className = "test-line test-pass";
          el.textContent = "\u2713 PASS: " + msg;
          report.appendChild(el);
        }

        function fail(msg){
          failCount++;
          var el = document.createElement("div");
          el.className = "test-line test-fail";
          el.textContent = "\u2717 FAIL: " + msg;
          report.appendChild(el);
        }

        function assert(condition, msg){
          if(condition) pass(msg);
          else fail(msg);
        }

        window.addEventListener("load", function(){
          window.setTimeout(function(){
            // Test 1: Chord data exists
            assert(!!window.CHORD_DATA, "window.CHORD_DATA should exist");
            assert(typeof window.CHORD_DATA === "object", "CHORD_DATA should be an object");

            // Test 2: 42 chords defined
            var keys = Object.keys(window.CHORD_DATA);
            assert(keys.length === 42, "Should have 42 chord entries, got " + keys.length);

            // Test 3: Root buttons exist
            var rootBtns = document.querySelectorAll(".chord-roots .chord-btn");
            assert(rootBtns.length === 7, "Should have 7 root buttons, got " + rootBtns.length);

            // Test 4: Variant buttons exist
            var variantBtns = document.querySelectorAll(".chord-variants .chord-btn");
            assert(variantBtns.length === 6, "Should have 6 variant buttons, got " + variantBtns.length);

            // Test 5: SVG diagram renders
            var svg = document.querySelector(".chord-diagram svg");
            assert(!!svg, "SVG diagram should exist in .chord-diagram");

            // Test 6: Chord label shows C
            var label = document.querySelector(".chord-label");
            assert(label && label.textContent === "C", "Chord label should show C, got: " + (label ? label.textContent : "null"));

            // Test 7: C active
            var cBtn = document.querySelector('.chord-roots [data-root="C"]');
            assert(cBtn && cBtn.classList.contains("active"), "C root button should be active");

            // Test 8: maj active
            var majBtn = document.querySelector('.chord-variants [data-variant="maj"]');
            assert(majBtn && majBtn.classList.contains("active"), "maj variant button should be active");

            // Test 9: Click D root updates chord
            var dBtn = document.querySelector('.chord-roots [data-root="D"]');
            if(dBtn){
              dBtn.click();
              var label2 = document.querySelector(".chord-label");
              setTimeout(function(){
                assert(label2.textContent === "D", "After clicking D, label should be D, got: " + label2.textContent);
                assert(dBtn.classList.contains("active"), "D button should be active after click");

                // Test 10: Click m variant shows Dm
                var mBtn = document.querySelector('.chord-variants [data-variant="m"]');
                if(mBtn){
                  mBtn.click();
                  setTimeout(function(){
                    var label3 = document.querySelector(".chord-label");
                    assert(label3.textContent === "Dm", "After clicking D+m, label should be Dm, got: " + label3.textContent);

                    // Test 11: SVG still exists after changes
                    var svg2 = document.querySelector(".chord-diagram svg");
                    assert(!!svg2, "SVG should still exist after chord change");

                    // Summary
                    summary.innerHTML = passCount + "/" + (passCount + failCount) + " tests passed" +
                      (failCount > 0 ? " (" + failCount + " failed)" : "");
                  }, 200);
                }
              }, 200);
            }

            // Wait a bit then print summary for tests 1-8 that don't need async
            setTimeout(function(){
              if(failCount === 0 && passCount >= 8){
                summary.innerHTML = passCount + "/" + (passCount + failCount) + " tests passed (initial checks)";
              }
            }, 500);
          }, 300);
        });
      })();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Run the smoke test**

Open `tests/chord-chart-smoke.html` in the browser and verify all tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/chord-chart-smoke.html
git commit -m "test: add chord chart smoke test"
```

---

### Task 8: Validate JavaScript syntax

**Files:**
- Modify: `scripts/validate-syntax.ps1`

- [ ] **Step 1: Add new JS files to validation**

Add `assets/js/chords.js` and `assets/js/chord-chart.js` to the `$filesToCheck` array in `scripts/validate-syntax.ps1`:

The `$filesToCheck` array should become:
```powershell
$filesToCheck = @(
    "assets/js/app.js",
    "assets/js/metronome.js",
    "assets/js/strummer.js",
    "assets/js/chords.js",
    "assets/js/chord-chart.js",
    "tests/metronome.test.js",
    "tests/run-test.js"
)
```

- [ ] **Step 2: Run validation**

```bash
.\scripts\validate-syntax.ps1
```

Expected: All files PASS.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate-syntax.ps1
git commit -m "chore: add chord chart JS files to syntax validation"
```

---

### Task 9: Final integration test

- [ ] **Step 1: Serve the site locally**

Use the `serve-mutils` skill to start the local server.

- [ ] **Step 2: Verify in browser**

Open the site and verify:
- Three widgets appear (metronome, strummer, chord chart)
- Chord chart shows "C" by default with SVG diagram
- Clicking different roots/variants updates the diagram and label
- Grid layout is correct at desktop width
- Mobile responsive layout stacks properly
- Existing metronome and strummer still work

