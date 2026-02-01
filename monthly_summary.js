/* =========================
   HELPERS
========================= */
function getAttendance() {
  return JSON.parse(localStorage.getItem("attendance")) || {};
}

function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

/* =========================
   LOAD MONTHLY SUMMARY
========================= */
function loadSummary() {
  const month = document.getElementById("monthInput").value; // format: YYYY-MM
  if (!month) {
    alert("Please select a month");
    return;
  }

  const attendance = getAttendance();
  const students = getStudents();

  const thead = document.querySelector("#summaryTable thead");
  const tbody = document.querySelector("#summaryTable tbody");

  thead.innerHTML = `
    <tr>
      <th>Student ID</th>
      <th>Name</th>
      <th>Present Days</th>
    </tr>
  `;

  tbody.innerHTML = "";

  students.forEach(student => {
    let presentCount = 0;

    // Check all dates inside attendance
    for (let date in attendance) {
      if (!date.startsWith(month)) continue;

      const dayRecord = attendance[date];
      const studentRecord = dayRecord[student.id];

      // Student is present if scans array exists and has one or more entries
      if (studentRecord && Array.isArray(studentRecord.scans) && studentRecord.scans.length > 0) {
        presentCount++;
      }
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name || "-"}</td>
      <td>${presentCount}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* =========================
   EXPORT TO EXCEL (CSV)
========================= */
function exportExcel() {
  const month = document.getElementById("monthInput").value;
  if (!month) {
    alert("Please select a month");
    return;
  }

  const attendance = getAttendance();
  const students = getStudents();

  let csv = "Student ID,Name,Present Days\n";

  students.forEach(student => {
    let presentCount = 0;

    for (let date in attendance) {
      if (!date.startsWith(month)) continue;

      const dayRecord = attendance[date];
      const studentRecord = dayRecord[student.id];

      if (studentRecord && Array.isArray(studentRecord.scans) && studentRecord.scans.length > 0) {
        presentCount++;
      }
    }

    csv += `${student.id},${student.name || ""},${presentCount}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Monthly_Attendance_${month}.csv`;
  link.click();
}
