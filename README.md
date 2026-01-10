# 🧍‍♂️ Real-Time Pose Tracking & Body Measurement (MediaPipe)

A browser-based real-time human pose tracking application built using **MediaPipe Pose (Tasks API)** and **HTML Canvas**.  
It uses your webcam to detect full-body landmarks, render a live skeletal model, and compute dynamic body-part distances with FPS monitoring and interactive controls.

---

## 🚀 Features

- 📸 Live webcam pose detection  
- 🧠 AI-powered 33-point body landmark tracking  
- 🕸 Real-time skeletal overlay  
- 📏 Dynamic limb and body-segment distance measurement  
- 🔁 Mirror mode  
- 🧩 Optional grid overlay  
- ⚡ Live FPS counter  
- 🎛 Start / Stop camera controls  

---

## 🛠 Tech Stack

- **JavaScript (ES Modules)**  
- **MediaPipe Tasks Vision API**  
- **HTML5 Canvas**  
- **Web APIs** (`getUserMedia`, `requestAnimationFrame`)  

---

## 📂 Project Structure

```txt
HEY PROJ
├── index.html        # Main pose tracking app
├── test_cam.html     # Camera testing page
├── package.json
├── README.md
