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

renderAttendanceHistory(student.id);

/* Generate QR CODE (NOT TEXT) */
new QRCode(document.getElementById("qrBox"), {
  text: student.id,
  width: 100,
  height: 100,
  correctLevel: QRCode.CorrectLevel.H
});
/* ===== Attendance History ===== */
function renderAttendanceHistory(studentId) {
  const attendance = JSON.parse(localStorage.getItem("attendance")) || {};
  const historyDiv = document.getElementById("attendanceHistory");

  let html = "";
  let found = false;

  Object.keys(attendance).sort().forEach(date => {
    const record = attendance[date][studentId];

    if (record) {
      found = true;

      html += `
        <div style="margin-bottom:8px;">
          <strong>${date}</strong>
          &nbsp; | &nbsp; ${record.status}
          &nbsp; | &nbsp; In: ${record.inTime || "-"} &nbsp; | &nbsp; Out: ${record.outTime || "-"}
        </div>
      `;
    }
  });

  if (!found) {
    html = "<p>No attendance record found</p>";
  }

  historyDiv.innerHTML = html;
}


