let html5Qr;
let scannedRecently = {};
const SCAN_COOLDOWN = 3000; // 3 seconds per ID

document.addEventListener("DOMContentLoaded", startScan);

function startScan() {
  html5Qr = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras().then(() => {
    html5Qr.start(
      { facingMode: "user" }, // FRONT CAMERA (IMPORTANT)
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      onScanSuccess
    );
  });
}

function onScanSuccess(decodedText) {
  const now = Date.now();

  // prevent duplicate fast scanning
  if (scannedRecently[decodedText] && now - scannedRecently[decodedText] < SCAN_COOLDOWN) {
    return;
  }

  scannedRecently[decodedText] = now;

  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students.find(s => s.id === decodedText);

  if (!student) {
    speak("Invalid ID");
    showStatus("Invalid ID", false);
    return;
  }

  markAttendance(student.id);
  speak("Attendance successful");
  showStatus(`Present: ${student.id}`, true);
}

function markAttendance(studentId) {
  const today = new Date().toISOString().split("T")[0];
  let attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

  if (!attendance[today]) attendance[today] = {};
  attendance[today][studentId] = "Present";

  localStorage.setItem("attendance", JSON.stringify(attendance));
}

function stopScan() {
  if (html5Qr) {
    html5Qr.stop().then(() => {
      window.close();
    });
  }
}

/* ===== Voice Feedback ===== */
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  window.speechSynthesis.speak(msg);
}

/* ===== Status Text ===== */
function showStatus(text, success) {
  const el = document.getElementById("scanStatus");
  el.innerText = text;
  el.className = success ? "success-text" : "error-text";
}
