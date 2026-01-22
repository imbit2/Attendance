let scanner;
const today = new Date().toISOString().split("T")[0];

function startScan() {
  const video = document.getElementById("qrVideo");

  // REQUIRED for mobile
  video.setAttribute("playsinline", true);

  scanner = new Instascan.Scanner({
    video: video,
    mirror: true
  });

  scanner.addListener("scan", handleScan);

  Instascan.Camera.getCameras()
    .then(cameras => {
      if (!cameras || cameras.length === 0) {
        alert("No camera found");
        return;
      }

      // Prefer front camera safely
      let cam = cameras.find(c =>
        (c.name || "").toLowerCase().includes("front")
      );

      scanner.start(cam || cameras[0]);
    })
    .catch(err => {
      console.error(err);
      alert("Camera permission denied or not supported");
    });
}

function stopScan() {
  if (scanner) scanner.stop();
  window.close();
}

function handleScan(content) {
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

  if (scans.length >= 2) {
    speak("Attendance already done");
    return;
  }

  if (scans.length === 1) {
    const [h, m] = scans[0].split(":").map(Number);
    const firstScan = new Date();
    firstScan.setHours(h, m, 0, 0);

    if ((now - firstScan) / 60000 < 60) {
      speak("Scan after 60 minutes");
      return;
    }
  }

  scans.push(timeStr);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  speak("Attendance successful");
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}
