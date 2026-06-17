let testFailed = false;

function appendResult(message, passed) {
  const report = document.getElementById('test-report');
  const line = document.createElement('div');
  line.className = 'test-line ' + (passed ? 'test-pass' : 'test-fail');
  line.textContent = (passed ? 'PASS: ' : 'FAIL: ') + message;
  report.appendChild(line);
  if (!passed) {
    testFailed = true;
  }
  return passed;
}

function appendSummary(message, passed) {
  const summary = document.getElementById('test-summary');
  summary.textContent = message;
  summary.className = passed ? 'test-summary test-pass' : 'test-summary test-fail';
  document.title = passed ? 'Metronome Smoke Test: PASS' : 'Metronome Smoke Test: FAIL';
}

function assert(condition, message) {
  if (!condition) {
    appendResult(message, false);
    throw new Error(message);
  }
  appendResult(message, true);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSmokeTests() {
  const bpmInput = document.getElementById('metronome-rpm');
  const toggleBtn = document.getElementById('metronome-toggle');  const tapBtn = document.getElementById('metronome-tap');
  const tapValue = document.getElementById('metronome-tap-value');
  const beats = document.querySelectorAll('.beat');

  assert(bpmInput !== null, 'BPM input should exist');
  assert(toggleBtn !== null, 'Toggle button should exist');  assert(tapBtn !== null, 'Tap tempo button should exist');
  assert(tapValue !== null, 'Tap tempo display should exist');
  assert(beats.length === 4, 'There should be 4 beat indicators');

  assert(toggleBtn.disabled === false, 'Toggle button should be enabled initially');
  tapBtn.click();
  await wait(80);
  tapBtn.click();
  await wait(80);
  tapBtn.click();
  await wait(80);

  const averageText = tapValue.textContent.trim();
  assert(averageText !== '--' && averageText !== '', 'Tap tempo should compute an average BPM');
  assert(Number(averageText) >= 30 && Number(averageText) <= 300, 'Tap tempo BPM should be in valid range');
  assert(Number(bpmInput.value) === Number(averageText), 'BPM input should update to tap tempo value');

  toggleBtn.click();
  await wait(120);
  assert(toggleBtn.textContent.trim() === 'Stop', 'Toggle button should show Stop after starting');

  toggleBtn.click();
  await wait(120);
  assert(toggleBtn.textContent.trim() === 'Start', 'Toggle button should show Start after stopping');
  appendSummary('Smoke tests passed.', true);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    runSmokeTests().catch(error => {
      appendSummary('Smoke tests failed: ' + error.message, false);
    });
  }, 100);
});
