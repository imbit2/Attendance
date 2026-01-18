const params = new URLSearchParams(location.search);
const studentId = params.get("id");

let students = JSON.parse(localStorage.getItem("students") || "[]");
let attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

const student = students.find(s => s.id === studentId);

if (!student) {
  alert("Student not found");
  location.href = "student_list.html";
}

/* =========================
   FILL FORM FIELDS
========================= */
document.getElementById("studentId").value = student.id;
document.getElementById("studentName").value = student.name || "";
document.getElementById("studentGuardian").value = student.guardian || "";
document.getElementById("studentDob").value = student.dob || "";
document.getElementById("studentBelt").value = student.belt || "";
document.getElementById("studentAddress").value = student.address || "";
document.getElementById("studentPhone").value = student.phone || "";

/* =========================
   UPDATE STUDENT
========================= */
function updateStudent() {
  student.name = document.getElementById("studentName").value.trim();
  student.guardian = document.getElementById("studentGuardian").value.trim();
  student.dob = document.getElementById("studentDob").value;
  student.belt = document.getElementById("studentBelt").value.trim();
  student.address = document.getElementById("studentAddress").value.trim();
  student.phone = document.getElementById("studentPhone").value.trim();

  localStorage.setItem("students", JSON.stringify(students));
  alert("Student updated successfully ✅");
}

/* =========================
   ATTENDANCE HISTORY
========================= */
function showHistory() {
  let html = "<h3>Attendance History</h3>";
  let found = false;

  for (let date in attendance) {
    if (attendance[date] && attendance[date][student.id]) {
      found = true;
      html += `<p>${date} : ${attendance[date][student.id]}</p>`;
    }
  }

  if (!found) html += "<p>No attendance record found</p>";

  document.getElementById("history").innerHTML = html;
}

/* =========================
   REPRINT ID CARD (OPTIONAL)
========================= */
function reprintCard() {
  location.href = "generate_student_qr.html?id=" + student.id;
}
