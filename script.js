function getStudents() {
  return JSON.parse(localStorage.getItem("students") || "[]");
}

function saveStudents(data) {
  localStorage.setItem("students", JSON.stringify(data));
}

function getAttendance() {
  return JSON.parse(localStorage.getItem("attendance") || "{}");
}

function saveAttendance(data) {
  localStorage.setItem("attendance", JSON.stringify(data));
}

// Internet date fallback-safe (India)
function today() {
  let d = new Date();
  return d.toISOString().slice(0, 10);
}

// called by scanner window
function markPresentFromQR(id) {
  let students = getStudents();
  let student = students.find(s => s.id === id);
  if (!student) {
    alert("Student not found");
    return;
  }

  let date = today();
  let att = getAttendance();
  if (!att[date]) att[date] = {};

  if (att[date][id] === "Present") {
    alert("Attendance already done");
    return;
  }

  att[date][id] = "Present";
  saveAttendance(att);
  alert(student.name + " marked Present");
}
document.addEventListener("DOMContentLoaded", () => {
  autoStoreAbsentForToday();
});

function autoStoreAbsentForToday() {
  const today = new Date().toLocaleDateString("en-CA");

  let students = JSON.parse(localStorage.getItem("students")) || [];
  let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

  if (!attendance[today]) {
    attendance[today] = {};
  }

  students.forEach(student => {
    // 🔴 SKIP if student name is empty
    if (!student.name || student.name.trim() === "") return;

    if (!attendance[today][student.id]) {
      attendance[today][student.id] = {
        status: "Absent",
        inTime: "",
        outTime: ""
      };
    }
  });

  localStorage.setItem("attendance", JSON.stringify(attendance));
}
window.addEventListener("pageshow", function (event) {
  // If page is loaded from back/forward cache
  if (event.persisted) {
    window.location.reload();
  }
});

