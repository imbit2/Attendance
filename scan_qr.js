let html5QrCode;
const today = new Date().toISOString().split("T")[0];

window.addEventListener("load", startScan);

function startScan() {
  html5QrCode = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras().then(devices => {
    if (!devices || devices.length === 0) {
      alert("No camera found");
      return;
    }

    // ✅ Prefer BACK camera
    const backCam =
      devices.find(d => d.label.toLowerCase().includes("back")) ||
      devices[devices.length - 1]; // fallback

    html5QrCode.start(
      { deviceId: { exact: backCam.id } },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }, // bigger = easier focus
        aspectRatio: 1.0,
        disableFlip: true
      },
      onScanSuccess,
      onScanFailure
    );
  });
}

function stopScan() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => window.close());
  }
}

function onScanSuccess(content) {
  handleAttendance(content);
}

function onScanFailure() {
  // ignore scan errors
}

/* =========================
   ATTENDANCE LOGIC (UNCHANGED)
========================= */
let scanLocked = false;

function handleAttendance(content) {
  if (scanLocked) return;

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const attendance = JSON.parse(localStorage.getItem("attendance")) || {};

  const student = students.find(s => s.id === content);
  if (!student) {
    speak("Invalid ID");
    return;
  }

  if (!attendance[today]) attendance[today] = {};
  if (!attendance[today][student.id]) {
    attendance[today][student.id] = { scans: [] };
  }

  const scans = attendance[today][student.id].scans;
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);

  /* ❌ Rule 3: More than 2 scans */
  if (scans.length >= 2) {
    speak("Attendance already done");
    return;
  }

  /* ❌ Rule 2: 2nd scan before 60 minutes */
  if (scans.length === 1) {
    const [h, m] = scans[0].split(":").map(Number);
    const firstScan = new Date();
    firstScan.setHours(h, m, 0, 0);

    if ((now - firstScan) / 60000 < 60) {
      speak("Scan after sixty minutes");
      return;
    }
  }

  /* ✅ Rule 1: Successful scan */
  scans.push(timeStr);
  localStorage.setItem("attendance", JSON.stringify(attendance));

  scanLocked = true;
  speak("Scan successful");

  /* ⏸ Pause 3 seconds before next scan */
  setTimeout(() => {
    scanLocked = false;
  }, 3000);
}

/* 🔊 Voice feedback */
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

