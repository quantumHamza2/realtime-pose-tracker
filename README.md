# Real-time Pose Tracker

Browser webcam demo using MediaPipe Tasks Vision, Canvas and JavaScript. It draws 33 pose landmarks, estimates screen-space segment distances, and offers mirror/grid controls.

## Run

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://localhost:8000/pose.html and press **Start Camera**. Grant camera permission. JavaScript, model weights and WASM download from external CDNs; a network connection and compatible browser/GPU are required. `test_cam.html` is a separate camera diagnostic.

**Stop** releases the camera. Startup/model failures and leaving the page also release resources. Inference happens in the browser; this demo contains no video-upload endpoint. Distances are image-space estimates, not calibrated body measurements or medical assessments.

The tracked `node_modules` directory is legacy content; the page imports Tasks Vision from a CDN and does not require npm installation. A future cleanup can remove vendored dependencies without changing the app.

## Manual checks

- Allow camera access, then stop and verify the camera indicator turns off.
- Deny access: a clear message appears and Start becomes available again.
- Block the model download: camera shuts off and retry is available.
- Restart twice; verify no old camera stream remains active.

Automated resource-lifecycle checks: `node --test tests/lifecycle.test.cjs`. These mock the webcam and model; real camera/browser checks remain manual.
