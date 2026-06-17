// Chord chart widget â€” select root/variant, view SVG fretboard diagram
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

        // Compute startFret: show 1st fret when possible; shift up only if chord won't fit
    const fretted = strings.filter(function(v){ return v > 0; });
    const maxFretted = fretted.length ? Math.max.apply(null, fretted) : 1;
    const startFret = Math.max(1, maxFretted - 2);
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
