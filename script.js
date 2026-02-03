/* =========================================================
   STUDENT HELPERS
========================================================= */
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(data) {
  localStorage.setItem("students", JSON.stringify(data));
}

/* =========================================================
   DATE HELPERS
========================================================= */
function today() {
  return new Date().toLocaleDateString("en-CA");
}

function yesterday() {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

/* =========================================================
   RUN ON PAGE LOAD
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  autoMarkAbsentsForYesterday();
  ensureTodayIsInitialized();
});

/* =========================================================
   1️⃣ AUTO-MARK ABSENT FOR YESTERDAY
========================================================= */
function autoMarkAbsentsForYesterday() {
  let y = yesterday();
  let todayDate = today();

  let students = getStudents();
  let history = JSON.parse(localStorage.getItem("attendance_history")) || {};

  // Already processed yesterday? stop.
  if (history[y] && history[y]._absentsProcessed) return;

  // If no record for yesterday → create empty
  if (!history[y]) history[y] = {};

  // Mark all missing students as absent
  students.forEach(s => {
    if (!s.name || s.name.trim() === "") return; // skip empty

    // If student never scanned yesterday → Absent
    if (!history[y][s.id]) {
      history[y][s.id] = {
        scans: [],
        status: "Absent",
        inTime: "",
        outTime: ""
      };
    }
  });

  // Add flag so it doesn't run twice
  history[y]._absentsProcessed = true;

  localStorage.setItem("attendance_history", JSON.stringify(history));
}

/* =========================================================
   2️⃣ ENSURE TODAY ATTENDANCE STRUCTURE EXISTS
   (BUT DO NOT MARK ABSENT)
========================================================= */
function ensureTodayIsInitialized() {
  const date = today();

  let todayAtt = JSON.parse(localStorage.getItem("attendance_today")) || {};
  let history = JSON.parse(localStorage.getItem("attendance_history")) || {};

  if (!history[date]) history[date] = {};
  if (!todayAtt) todayAtt = {};

  // Save back but DO NOT fill absents
  localStorage.setItem("attendance_today", JSON.stringify(todayAtt));
  localStorage.setItem("attendance_history", JSON.stringify(history));
}

/* =========================================================
   SAFARI / MOBILE BACK-CACHE FIX
========================================================= */
window.addEventListener("pageshow", event => {
  if (event.persisted) window.location.reload();
});
