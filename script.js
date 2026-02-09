/* =========================================================
   MAIN PAGE LOADER
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  const filename = window.location.pathname.split("/").pop();

  /* ---------------------------------------------
     1️⃣ LOGIN PROTECTION (runs on all pages except login)
  --------------------------------------------- */
  if (filename !== "login.html") {
    const role = localStorage.getItem("logged_role");

    if (!role) {
      window.location.href = "login.html";
      return;
    }

    enforceAdminPermissions(role);
  }

  /* ---------------------------------------------
     2️⃣ ATTENDANCE LOGIC (only for these pages)
        -> index.html
        -> scan.html
  --------------------------------------------- */
  const attendancePages = ["index.html"];

  if (attendancePages.includes(filename)) {
    autoMarkAbsentsForYesterday();
    ensureTodayIsInitialized();
  }

});

/* =========================================================
   LOGIN / ROLE SYSTEM
========================================================= */
function enforceAdminPermissions(role) {

  if (role !== "admin") {

    // Hide admin-only elements
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "none";
    });
  }
}
/* =========================================================
   ADMIN-ONLY FUNCTION GUARD
========================================================= */
function adminOnly() {
  const role = localStorage.getItem("logged_role");
  if (role !== "admin") {
    alert("Only admin can perform this action.");
    throw new Error("Unauthorized action by coach.");
     return;
  }
}

function logout() {
  localStorage.removeItem("logged_role");
  window.location.href = "login.html";
}

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
   1️⃣ AUTO-MARK ABSENT FOR YESTERDAY
========================================================= */
function autoMarkAbsentsForYesterday() {
  let y = yesterday();

  let students = getStudents();
  let history = JSON.parse(localStorage.getItem("attendance_history")) || {};

  // Already processed → skip
  if (history[y] && history[y]._absentsProcessed) return;

  // Create empty container if missing
  if (!history[y]) history[y] = {};

  // Mark all missing as absent
  students.forEach(s => {
    if (!s.name || s.name.trim() === "") return;

    if (!history[y][s.id]) {
      history[y][s.id] = {
        scans: [],
        status: "Absent",
        inTime: "",
        outTime: ""
      };
    }
  });

  // Mark yesterday as processed
  history[y]._absentsProcessed = true;

  localStorage.setItem("attendance_history", JSON.stringify(history));
}

/* =========================================================
   2️⃣ ENSURE TODAY IS INITIALIZED (NO ABSENTS)
========================================================= */
function ensureTodayIsInitialized() {
  const date = today();

  let todayAtt = JSON.parse(localStorage.getItem("attendance_today")) || {};
  let history = JSON.parse(localStorage.getItem("attendance_history")) || {};

  if (!history[date]) history[date] = {};

  localStorage.setItem("attendance_today", JSON.stringify(todayAtt));
  localStorage.setItem("attendance_history", JSON.stringify(history));
}

/* =========================================================
   SAFARI BACK-CACHE FIX
========================================================= */
window.addEventListener("pageshow", event => {
  if (event.persisted) window.location.reload();
});

function exportStudentsToExcel() {
    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (students.length === 0) {
        alert("No student data found!");
        return;
    }

    // Convert structure exactly as stored
    let exportData = students.map(s => ({
        "Student ID": s.id || "",
        "Name": s.name || "",
        "Guardian": s.guardian || "",
        "Date of Birth": s.dob || "",
        "Address": s.address || "",
        "Belt": s.belt || "",
        "Phone": s.phone || "",
        "Created At": s.createdAt || "",
        "Updated At": s.updatedAt || ""
    }));

    // Convert JSON → Excel Sheet
    let ws = XLSX.utils.json_to_sheet(exportData);

    // Create Workbook
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // File Download
    XLSX.writeFile(wb, "Student_Master_Data.xlsx");

    alert("Excel exported successfully!");
}
