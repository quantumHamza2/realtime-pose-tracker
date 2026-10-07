const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../pose.html'), 'utf8').match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/import .*?;\n/, '');
function setup(failModel = false) {
  let stopped = 0, closed = 0;
  const elements = {};
  const events = {};
  const context = vm.createContext({
    document: {getElementById(id) {
      return elements[id] ||= { addEventListener: () => {}, play: async () => {}, getContext: () => ({clearRect(){},drawImage(){}}) };
    }},
    window: {innerWidth:1280, innerHeight:720, addEventListener:(name, fn) => events[name] = fn},
    navigator: {mediaDevices:{getUserMedia:async () => ({getTracks:() => [{stop:() => stopped++}]})}},
    performance: {now:()=>1}, requestAnimationFrame:()=>1, cancelAnimationFrame:()=>{}, console,
    FilesetResolver: {forVisionTasks:async()=>({})},
    PoseLandmarker: {createFromOptions:async()=>{ if(failModel) throw Error('offline'); return {close:()=>closed++,detectForVideo:()=>({landmarks:[]})}; }}
  });
  vm.runInContext(source, context);
  return {context, elements, events, stopped:()=>stopped, closed:()=>closed};
}
test('model failure releases the camera and allows retry', async () => {
  const app = setup(true);
  await vm.runInContext('startAll()', app.context);
  assert.equal(app.stopped(),1);
  assert.equal(app.elements.input_video.srcObject,null);
  assert.equal(app.elements.startBtn.disabled,false);
});
test('leaving the page releases resources exactly once', async () => {
  const app = setup();
  await vm.runInContext('startAll()', app.context);
  app.events.pagehide(); app.events.pagehide();
  assert.equal(app.stopped(),1); assert.equal(app.closed(),1);
  assert.equal(app.elements.input_video.srcObject,null);
});
