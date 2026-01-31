let html5QrCode;
let scanStarted = false;
const today = new Date().toLocaleDateString("en-CA");

/* window.addEventListener("load", () => {
  setTimeout(startScan, 300); // small delay = stable camera startup
}); */

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

      const backCam =
        devices.find(d => d.label.toLowerCase().includes("back")) ||
        devices[devices.length - 1];

      return html5QrCode.start(
        { deviceId: { exact: backCam.id } },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          disableFlip: true,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          videoConstraints: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        },
        onScanSuccess,
        onScanFailure
      );
    })
    .catch(err => {
      console.log("Camera error:", err);
      scanStarted = false;
      setTimeout(startScan, 1000);
    });
}

function stopScan() {
  if (!html5QrCode) return;

  html5QrCode.stop()
    .then(() => {
      scanStarted = false;
      window.close();
    })
    .catch(() => {
      scanStarted = false;
    });
}

function onScanSuccess(content) {
  handleAttendance(content);
}

let failCooldown = false;

function onScanFailure(error) {
  if (failCooldown) return;
  failCooldown = true;
  setTimeout(() => failCooldown = false, 200); // 0.2 sec delay
}

/* =========================
   ATTENDANCE LOGIC
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
    attendance[today][student.id] = {
      scans: [],
      status: "Absent"
    };
  }

  const record = attendance[today][student.id];
  const scans = record.scans;

  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 5);

  if (scans.length >= 2) {
    speak("Attendance already done");
    return;
  }

  if (scans.length === 1) {
    const [h, m] = scans[0].split(":").map(Number);
    const firstScan = new Date();
    firstScan.setHours(h, m, 0, 0);

    if ((now - firstScan) / 60000 < 60) {
      speak("Scan after sixty minutes");
      return;
    }

    scans.push(timeStr);
    localStorage.setItem("attendance", JSON.stringify(attendance));
    speak("Thank You");
    return;
  }

  scans.push(timeStr);
  record.status = "Present";
  localStorage.setItem("attendance", JSON.stringify(attendance));

  speak("Welcome to Playmate");
}

function speak(text) {
  scanLocked = true;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);

  setTimeout(() => {
    scanLocked = false;
  }, 3000);
}


