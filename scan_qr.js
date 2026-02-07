let html5QrCode;
let scanStarted = false;
const today = new Date().toLocaleDateString("en-CA");

let studentsCache = [];
try {
  studentsCache = JSON.parse(localStorage.getItem("students")) || [];
} catch (e) {
  studentsCache = [];
}

/* =============================
   RESET ATTENDANCE (on page load)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  resetAttendanceForToday();
  loadStudentsData();
});

/* =============================
   RESET ATTENDANCE FOR TODAY
============================= */
function resetAttendanceForToday() {
  const date = today();
  let attendanceToday = JSON.parse(localStorage.getItem("attendance_today")) || {};
  
  // Check if the stored date matches today's date; if not, reset the data
  if (!attendanceToday[date]) {
    // Reset attendance for all students for today
    let students = getStudents();

    students.forEach(student => {
      if (!student.name || student.name.trim() === "") return; // Skip students with no name

      attendanceToday[student.id] = {
        scans: [],
        status: "Absent", // Mark as absent by default
        inTime: "",
        outTime: ""
      };
    });

    localStorage.setItem("attendance_today", JSON.stringify(attendanceToday));
  }
}

/* =============================
   LOAD STUDENT DATA
============================= */
function loadStudentsData() {
  studentsCache = getStudents();
}

/* =============================
   START QR SCAN
============================= */
function startScan() {
  if (scanStarted) return;
  scanStarted = true;

  html5QrCode = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras()
    .then(devices => {
      if (!devices || devices.length === 0) {
        alert("No camera found");
        scanStarted = false;
        return;
      }

      let bestCam = devices[0];
      devices.forEach(cam => {
        if (cam.id.length > bestCam.id.length) bestCam = cam;
      });

      return html5QrCode.start(
        { deviceId: { exact: bestCam.id } },
        {
          fps: 25,
          qrbox: { width: 300, height: 300 },
          disableFlip: true,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          videoConstraints: { facingMode: "environment" }
        },
        onScanSuccess,
        onScanFailure
      );
    })
    .catch(() => {
      scanStarted = false;
      setTimeout(startScan, 1000);
    });
}

/* =============================
   FIXED SCAN LOCKING
============================= */
let scanLocked = false;
let failCooldown = false;

function onScanSuccess(content) {
  if (scanLocked) return;       // ❌ Ignore repeated detections
  scanLocked = true;            // 🔒 Lock immediately

  handleAttendance(content);

  setTimeout(() => {
    scanLocked = false;         // 🔓 Unlock after 3 seconds
  }, 3000);
}

function onScanFailure() {
  if (failCooldown) return;
  failCooldown = true;
  setTimeout(() => failCooldown = false, 200);
}

/* =============================
   ATTENDANCE LOGIC (unchanged)
============================= */
function handleAttendance(content) {

  const student = studentsCache.find(s => s.id === content);

  if (!student) {
    speak("Invalid ID");
    return;
  }

  let todayAtt = JSON.parse(localStorage.getItem("attendance_today")) || {};
  let history = null;

  if (!todayAtt[student.id]) {
    todayAtt[student.id] = { scans: [], status: "Absent" };
  }

  const record = todayAtt[student.id];
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);

  if (record.scans.length >= 2) {
    speak("Attendance already done");
    return;
  }

  if (record.scans.length === 1) {
    const [h, m] = record.scans[0].split(":").map(Number);
    const firstScan = new Date();
    firstScan.setHours(h, m, 0, 0);

    const diffMins = (now - firstScan) / 60000;

    if (diffMins < 60) {
      speak("Scan after sixty minutes");
      return;
    }

    record.scans.push(timeStr);

    localStorage.setItem("attendance_today", JSON.stringify(todayAtt));

    history = JSON.parse(localStorage.getItem("attendance_history")) || {};
    if (!history[today]) history[today] = {};
    history[today][student.id] = record;
    localStorage.setItem("attendance_history", JSON.stringify(history));

    speak("Thank you");
    return;
  }

  record.scans.push(timeStr);
  record.status = "Present";

  localStorage.setItem("attendance_today", JSON.stringify(todayAtt));

  history = JSON.parse(localStorage.getItem("attendance_history")) || {};
  if (!history[today]) history[today] = {};
  history[today][student.id] = record;
  localStorage.setItem("attendance_history", JSON.stringify(history));

  speak("Welcome to Playmate");
}

/* =============================
   SPEECH
============================= */
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}
