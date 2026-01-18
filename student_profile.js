const params = new URLSearchParams(location.search);
const studentId = params.get("id");

if (!studentId) {
  alert("Invalid student");
  window.close();
}

const students = JSON.parse(localStorage.getItem("students")) || [];
const student = students.find(s => s.id === studentId);

if (!student) {
  alert("Student not found");
  window.close();
}

/* Fill student data */
document.getElementById("pId").innerText = student.id;
document.getElementById("pName").innerText = student.name || "-";
document.getElementById("pGuardian").innerText = student.guardian || "-";
document.getElementById("pDob").innerText = student.dob || "-";
document.getElementById("pBelt").innerText = student.belt || "-";
document.getElementById("pPhone").innerText = student.phone || "-";
document.getElementById("pAddress").innerText = student.address || "-";

/* Generate QR CODE (NOT TEXT) */
new QRCode(document.getElementById("qrBox"), {
  text: student.id,
  width: 100,
  height: 100,
  correctLevel: QRCode.CorrectLevel.H
});
/* ===== Attendance History ===== */
const attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

let historyHTML = "";
let found = false;

for (let date in attendance) {
  if (attendance[date][student.id]) {
    found = true;
    historyHTML += `<p>${date} : ${attendance[date][student.id]}</p>`;
  }
}

if (!found) {
  historyHTML = "<p>No attendance record found</p>";
}

document.getElementById("attendanceHistory").innerHTML = historyHTML;

