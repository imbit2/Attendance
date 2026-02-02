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

/* Generate QR CODE */
new QRCode(document.getElementById("qrBox"), {
  text: student.id,
  width: 100,
  height: 100,
  correctLevel: QRCode.CorrectLevel.H
});

/* ===========================
   NEW Attendance History
=========================== */
function renderAttendanceHistory(studentId) {
  const history = JSON.parse(localStorage.getItem("attendance_history")) || {};
  const historyDiv = document.getElementById("attendanceHistory");

  let html = "";
  let found = false;

  // Sort by date (ascending)
  const dates = Object.keys(history).sort();

  dates.forEach(date => {
    const record = history[date][studentId];

    if (record) {
      found = true;

      // Convert scans array to readable in/out
      const inTime = record.scans?.[0] || "-";
      const outTime = record.scans?.[1] || "-";

      html += `
        <div style="margin-bottom:8px;">
          <strong>${date}</strong>
          &nbsp; | &nbsp; ${record.status}
          &nbsp; | &nbsp; In: ${inTime}
          &nbsp; | &nbsp; Out: ${outTime}
        </div>
      `;
    }
  });

  if (!found) {
    html = "<p>No attendance record found</p>";
  }

  historyDiv.innerHTML = html;
}

renderAttendanceHistory(student.id);
