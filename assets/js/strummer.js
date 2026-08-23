// Guitar strummer widget — 8-note pattern player with up/down/mute toggle per note
;(function(){
  let audioCtx = null;
  let timerID = null;
  let nextNoteTime = 0.0;
  let currentStep = 0;
  let isRunning = false;
  let tempo = 120;
  let scheduleAheadTime = 0.1;
  let lookahead = 25.0;
  let currentMeter = 4;
  let noteBtns = [];
  let noteWraps = [];

  // Default pattern: D, D, U, U, D, U, D, U (basic 4/4 strumming)
  const defaultPattern = {
    3: ["down","down","up","up","down","up"],
    4: ["down","down","up","up","down","up","down","up"]
  };

  // 5-state icon lookup
  var iconLookup = { down: "↓", up: "↑", mute: "—", "mute&up": "—↑", "down&up": "↓↑" };

  function clampBPM(v){ return Math.max(40, Math.min(240, Math.round(v||120))); }
  function clampMeter(v){ return (v === 3) ? 3 : 4; }

  function initAudio(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function getPatternForMeter(meter){
    const targetMeter = clampMeter(meter);
    const base = defaultPattern[targetMeter] || defaultPattern[4];
    const saved = (() => {
      try {
        const raw = localStorage.getItem("strummer-pattern");
        if(!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        return null;
      }
    })();

    if(Array.isArray(saved) && saved.length === base.length){
      return saved.slice(0, base.length);
    }

    if(Array.isArray(saved) && saved.length > 0){
      return saved.slice(0, base.length).concat(base.slice(Math.min(saved.length, base.length))); 
    }

    return base.slice();
  }

  function bindStrumButton(button, noteContainer, pattern){
    if(!button) return;
    button.addEventListener("click", function(){
      if(isRunning) return;
      const btnIndex = Array.from(noteContainer.querySelectorAll(".strum-note-btn")).indexOf(this);
      const cur = this.dataset.strum || pattern[btnIndex] || "down";
      const nextLookup = { down: "up", up: "mute", mute: "mute&up", "mute&up": "down&up", "down&up": "down" };
      const next = nextLookup[cur] || "down";
      this.dataset.strum = next;
      this.textContent = iconLookup[next] || "↓";
      const pat = Array.from(noteContainer.querySelectorAll(".strum-note-btn")).map(b => b.dataset.strum);
      try{ localStorage.setItem("strummer-pattern", JSON.stringify(pat)); }catch(e){}
    });
  }

  function renderStrumFields(){
    const meterButtons = Array.from(document.querySelectorAll(".meter-btn"));
    const noteContainer = document.querySelector(".strum-notes");
    if(!noteContainer) return;

    const targetCount = currentMeter === 3 ? 6 : 8;
    const existing = Array.from(noteContainer.querySelectorAll(".strum-note"));
    const pattern = getPatternForMeter(currentMeter);

    existing.forEach((el, index) => {
      if(index < targetCount) {
        const btn = el.querySelector(".strum-note-btn");
        const dir = pattern[index] || "down";
        btn.dataset.strum = dir;
        btn.textContent = iconLookup[dir] || "↓";
        bindStrumButton(btn, noteContainer, pattern);
      } else {
        el.remove();
      }
    });

    while(noteContainer.children.length < targetCount){
      const newWrap = document.createElement("div");
      newWrap.className = "strum-note";
      newWrap.setAttribute("role", "listitem");
      const newBtn = document.createElement("button");
      newBtn.type = "button";
      newBtn.className = "strum-note-btn";
      const dir = pattern[noteContainer.children.length] || "down";
      newBtn.dataset.strum = dir;
      newBtn.textContent = iconLookup[dir] || "↓";
      newBtn.setAttribute("aria-label", "Note " + (noteContainer.children.length + 1));
      bindStrumButton(newBtn, noteContainer, pattern);
      newWrap.appendChild(newBtn);
      noteContainer.appendChild(newWrap);
    }

    noteBtns = Array.from(noteContainer.querySelectorAll(".strum-note-btn"));
    noteWraps = Array.from(noteContainer.querySelectorAll(".strum-note"));
    currentStep = Math.min(currentStep, Math.max(noteBtns.length - 1, 0));

    meterButtons.forEach((btn) => {
      const isActive = clampMeter(Number(btn.dataset.meter || 4)) === currentMeter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function bindAndInit(){
    const metronomeRpmInput = document.getElementById("metronome-rpm");
    const toggleBtn = document.getElementById("strum-toggle");
    const noteContainer = document.querySelector(".strum-notes");
    const meterButtons = Array.from(document.querySelectorAll(".meter-btn"));

    if(!toggleBtn || !noteContainer) return;

    function applyMeter(meter){
      currentMeter = clampMeter(Number(meter || 4));
      renderStrumFields();
    }

    currentMeter = (() => {
      const enabledBtn = meterButtons.find((btn) => btn.classList.contains("active"));
      return clampMeter(Number((enabledBtn && enabledBtn.dataset.meter) || 4));
    })();

    renderStrumFields();

    // Read tempo from the shared metronome BPM input
    if(metronomeRpmInput){
      tempo = clampBPM(Number(metronomeRpmInput.value));
    }

    meterButtons.forEach((btn) => {
      btn.addEventListener("click", function(){
        applyMeter(this.dataset.meter || 4);
      });
    });

    window.addEventListener("moosician-meter-change", function(event){
      const meter = Number((event && event.detail && event.detail.meter) || currentMeter || 4);
      applyMeter(meter);
    });

    // Strum sound: "da" for down, "di" for up
    function playStrum(strumDir, time){
      if(!audioCtx) initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Down = lower pitch (da), Up = higher pitch (di)
      if(strumDir === "down"){
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, time);       // A3 — "da"
        osc.frequency.linearRampToValueAtTime(180, time + 0.04);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, time);       // A4 — "di"
        osc.frequency.linearRampToValueAtTime(360, time + 0.04);
      }

      gain.gain.setValueAtTime(0.0, time);
      gain.gain.linearRampToValueAtTime(0.55, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + 0.14);
    }

    // UI highlight on current note
    function highlightStep(stepIndex){
      noteWraps.forEach(w => w.classList.remove("active"));
      if(noteWraps[stepIndex]) noteWraps[stepIndex].classList.add("active");
    }

    function scheduleNote(stepIndex, time){
      const dir = noteBtns[stepIndex]?.dataset.strum || "down";
      if(dir === "mute&up"){
        playStrum("up", time + (60.0 / tempo / 4));  // mute first half, up second half
      } else if(dir === "down&up"){
        playStrum("down", time);
        playStrum("up", time + (60.0 / tempo / 4));
      } else if(dir !== "mute"){
        playStrum(dir, time);
      }
      window.requestAnimationFrame(() => highlightStep(stepIndex));
    }

    function nextNote(){
      const stepsInPattern = Math.max(noteBtns.length || (currentMeter === 3 ? 6 : 8), 1);
      const secondsPerStep = 60.0 / tempo / 2;
      nextNoteTime += secondsPerStep;
      currentStep = (currentStep + 1) % stepsInPattern;
    }

    function scheduler(){
      const stepsInPattern = Math.max(noteBtns.length || (currentMeter === 3 ? 6 : 8), 1);
      while(nextNoteTime < audioCtx.currentTime + scheduleAheadTime){
        scheduleNote(currentStep % stepsInPattern, nextNoteTime);
        nextNote();
      }
    }

    function start(){
      if(isRunning) return;
      initAudio();
      if(metronomeRpmInput){
        tempo = clampBPM(Number(metronomeRpmInput.value));
      }
      // Auto-resume AudioContext (required after user gesture in modern browsers)
      if(audioCtx.state === "suspended"){
        audioCtx.resume();
      }
      isRunning = true;
      toggleBtn.textContent = "Stop";
      currentStep = 0;
      nextNoteTime = audioCtx.currentTime + 0.05;
      timerID = window.setInterval(scheduler, lookahead);
          }

    function stop(){
      if(!isRunning) return;
      isRunning = false;
      toggleBtn.textContent = "Start";
      if(timerID){ clearInterval(timerID); timerID = null; }
      noteWraps.forEach(w => w.classList.remove("active"));
          }

    // UI wiring
    toggleBtn.addEventListener("click", function(){
      if(isRunning) stop();
      else start();
    });

    // Keyboard shortcut: space toggles when strummer is focused
    document.addEventListener("keydown", function(e){
      if(e.code === "Space" && document.activeElement &&
        (document.activeElement === toggleBtn)){
        e.preventDefault();
        if(isRunning) stop(); else start();
      }
    });

    // Expose for debugging
    window._strummer = { start, stop, setBpm: function(v){ if(metronomeRpmInput){ metronomeRpmInput.value = clampBPM(v); tempo = Number(metronomeRpmInput.value); } } };
  }

  function waitForAppReady(){
    if(document.body && document.body.dataset && document.body.dataset.ready === "true"){
      bindAndInit();
      return;
    }
    const obs = new MutationObserver(function(mutations){
      for(let i = 0; i < mutations.length; i++){
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

