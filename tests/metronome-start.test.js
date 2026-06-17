const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

class FakeClassList {
  constructor() {
    this.items = new Set();
  }
  add(...names) {
    names.forEach((name) => this.items.add(name));
  }
  remove(...names) {
    names.forEach((name) => this.items.delete(name));
  }
}

class FakeElement {
  constructor(id) {
    this.id = id;
    this.textContent = '';
    this.disabled = false;
    this.dataset = {};
    this.attributes = {};
    this.classList = new FakeClassList();
    this.listeners = {};
    this.ariaPressed = null;
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  click() {
    if (typeof this.listeners.click === 'function') {
      this.listeners.click({ preventDefault() {}, code: 'Mouse' });
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'aria-pressed') {
      this.ariaPressed = String(value);
    }
  }

  getAttribute(name) {
    if (name === 'aria-pressed') {
      return this.ariaPressed;
    }
    return this.attributes[name] ?? null;
  }
}

const toggleBtn = new FakeElement('metronome-toggle');
toggleBtn.textContent = 'Start';
const bpmInput = new FakeElement('metronome-rpm');
bpmInput.value = '120';
const tapBtn = new FakeElement('metronome-tap');
const tapValue = new FakeElement('metronome-tap-value');
const statusLive = new FakeElement('metronome-status');
const beats = [new FakeElement(), new FakeElement(), new FakeElement(), new FakeElement()];

let setIntervalCalls = 0;
let clearIntervalCalls = 0;
let activeInterval = null;

const documentStub = {
  body: { dataset: { ready: 'true' } },
  getElementById(id) {
    switch (id) {
      case 'metronome-rpm':
        return bpmInput;
      case 'metronome-toggle':
        return toggleBtn;      case 'metronome-tap':
        return tapBtn;
      case 'metronome-tap-value':
        return tapValue;
      case 'metronome-status':
        return statusLive;
      default:
        return null;
    }
  },
  querySelectorAll(selector) {
    if (selector === '.beat') {
      return beats;
    }
    return [];
  },
  addEventListener() {},
};

const windowStub = {
  document: documentStub,
  localStorage: {
    getItem() { return null; },
    setItem() {},
  },
  performance: { now: () => 0 },
  requestAnimationFrame(cb) { cb(); },
  setInterval(fn) {
    setIntervalCalls += 1;
    activeInterval = fn;
    return 1;
  },
  clearInterval() {
    clearIntervalCalls += 1;
    activeInterval = null;
  },
  setTimeout(fn) {
    fn();
    return 1;
  },
  clearTimeout() {},
  addEventListener() {},
  AudioContext: class {
    constructor() {
      this.state = 'suspended';
      this.currentTime = 0;
      this.destination = {};
    }

    resume() {
      return new Promise(() => {});
    }

    createOscillator() {
      return {
        type: 'sine',
        frequency: {
          value: 0,
          setValueAtTime() {},
          linearRampToValueAtTime() {},
        },
        connect() {},
        start() {},
        stop() {},
      };
    }

    createGain() {
      return {
        gain: {
          setValueAtTime() {},
          linearRampToValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        connect() {},
      };
    }
  },
  webkitAudioContext: null,
};

const context = {
  window: windowStub,
  document: documentStub,
  MutationObserver: class {
    constructor() {}
    observe() {}
    disconnect() {}
  },
  localStorage: windowStub.localStorage,
  performance: windowStub.performance,
  requestAnimationFrame: windowStub.requestAnimationFrame,
  setInterval: windowStub.setInterval,
  clearInterval: windowStub.clearInterval,
  setTimeout: windowStub.setTimeout,
  clearTimeout: windowStub.clearTimeout,
  console,
};

context.window.window = context.window;
context.window.document = documentStub;
context.window.MutationObserver = context.MutationObserver;
context.window.console = console;
context.window.performance = windowStub.performance;
context.window.requestAnimationFrame = windowStub.requestAnimationFrame;
context.window.setInterval = windowStub.setInterval;
context.window.clearInterval = windowStub.clearInterval;
context.window.setTimeout = windowStub.setTimeout;
context.window.clearTimeout = windowStub.clearTimeout;
context.window.addEventListener = windowStub.addEventListener;
context.window.localStorage = windowStub.localStorage;

const scriptPath = path.join(__dirname, '../assets/js/metronome.js');
const script = fs.readFileSync(scriptPath, 'utf-8');
vm.runInNewContext(script, context, { filename: scriptPath });

toggleBtn.click();

assert.strictEqual(toggleBtn.textContent, 'Stop', 'toggle button should flip immediately');
assert.strictEqual(setIntervalCalls, 1, 'metronome should start scheduling immediately');
assert.strictEqual(statusLive.textContent, 'Started at 120 BPM', 'status should update when starting');
assert.strictEqual(typeof activeInterval, 'function', 'scheduler should be active');

console.log('metronome start regression passed');
