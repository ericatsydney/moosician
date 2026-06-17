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
