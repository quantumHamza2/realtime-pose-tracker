const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../pose.html'), 'utf8')
  .match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/import .*?;\n/, '');

function setup() {
  const calls = [];
  const drawing = new Proxy({}, {
    get: (_, method) => (...args) => calls.push([method, ...args]),
    set: () => true,
  });
  const elements = {};
  const context = vm.createContext({
    document: {getElementById: id => elements[id] ||= {
      addEventListener() {}, getContext: () => drawing,
    }},
    window: {innerWidth: 1000, innerHeight: 500, addEventListener() {}},
    performance: {now: () => 20},
    requestAnimationFrame: () => { calls.push(['schedule']); return 1; },
  });
  vm.runInContext(source, context);
  return {context, calls};
}

test('mirror toggle keeps points, skeleton and distance labels aligned with video', () => {
  const app = setup();
  for (const mirrored of [true, false]) {
    app.calls.length = 0;
    vm.runInContext(`mirror = ${mirrored};
      drawResults(Array.from({length: 33}, () => ({x: 0.2, y: 0.3})));`, app.context);
    const x = mirrored ? 800 : 200;
    assert.deepEqual(app.calls.filter(c => c[0] === 'scale'), mirrored ? [['scale', -1, 1]] : []);
    const image = app.calls.find(c => c[0] === 'drawImage');
    assert.deepEqual(image.slice(2), [mirrored ? -1000 : 0, 0, 1000, 500]);
    const points = app.calls.filter(c => c[0] === 'arc');
    assert.equal(points.length, 33);
    for (const point of points) assert.deepEqual(point.slice(1, 3), [x, 150]);
    assert.deepEqual(app.calls.find(c => c[0] === 'moveTo'), ['moveTo', x, 150]);
    assert.deepEqual(app.calls.find(c => c[0] === 'fillText'),
      ['fillText', 'L Upper Arm: 0.0 px', x + 6, 144]);
  }
});

test('frames without a detected pose preserve mirror and grid settings', async () => {
  const app = setup();
  await vm.runInContext(`running = true; showGrid = true;
    landmarker = {detectForVideo: () => ({landmarks: []})}; videoLoop();`, app.context);
  assert.deepEqual(app.calls.find(c => c[0] === 'scale'), ['scale', -1, 1]);
  assert.deepEqual(app.calls.find(c => c[0] === 'drawImage').slice(2), [-1000, 0, 1000, 500]);
  assert.equal(app.calls.filter(c => c[0] === 'moveTo').length, 15);
  assert.equal(app.calls.filter(c => c[0] === 'arc').length, 0);
  assert.equal(app.calls.filter(c => c[0] === 'schedule').length, 1);
});
