# Chord Chart Widget Design

## Summary

Add a chord chart widget to the Moosician static site. Users select a root note and variant from side-by-side button rows; an inline SVG fretboard diagram shows the chord voicing. 42 chords (7 roots × 6 variants), every combination available.

## Chord set

7 roots: C, D, E, F, G, A, B. 6 variants: maj, m, 7, maj7, m7, sus4. All 42 combinations defined with standard guitar voicings.

## Layout

A new `.widget-card` sits inside `.workspace-grid` alongside metronome and strummer. Desktop ≥960px: grid becomes 3-column (`1fr 1fr 1fr`). Below 960px: two cards per row (strummer + chord chart). Mobile <760px: all stack vertically.

Widget card structure: h2 title, widget-subtitle description, selector row (roots || variants), compact SVG fretboard (~240px wide), chord name label below.

## Selector UI

Two rows of buttons laid out side-by-side in a single horizontal band. Root notes (C D E F G A B) on the left, variants (maj m 7 maj7 m7 sus4) on the right. Single-select on each row — clicking updates the chord instantly. Active buttons get an `.active` class.

## Chord data model

File: `assets/js/chords.js`. A lookup keyed by `"root-variant"` (e.g., `"C-maj"`). Each entry: `name`, `strings` array (6 values, low E to high e: 0=open, -1=muted, fret number), optional `barres` array (spanning string range at a fret). Absolute fret positions — renderer computes the display window.

## SVG fretboard

File: `assets/js/chord-chart.js`. Pure function `renderChord(chordData)` returns an SVG string. Dimensions ~240×180px, 6 strings × 3 visible frets. Features: X/O markers for muted/open strings above the nut, thick nut line (or thin line + fret number label when startFret > 1), filled accent-colored dots at finger positions, curved barre arcs rendered behind dots. Default state: all strings open (empty fretboard).

## Integration

New files: `assets/js/chords.js`, `assets/js/chord-chart.js`, `assets/css/chord-chart.css`. Widget JS follows existing IIFE pattern — binds after `body[data-ready="true"]`. `index.html` gets new `<link>` and `<script>` tags. `components/main.html` gets the third widget card HTML. `assets/css/styles.css` `.workspace-grid` updated for 3-column layout at ≥960px.

## Error handling

If chord data lookup fails, display "Chord not available" in place of SVG. Widget degrades gracefully — selectors remain usable.

## SEO

Add chord-related keywords to widget subtitle and update JSON-LD HowTo or add a new structured data block for the chord chart tool.