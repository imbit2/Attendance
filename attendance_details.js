/* ============================
   LOAD ATTENDANCE DETAILS
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const dateParam = new URLSearchParams(location.search).get("date");

  if (!dateParam) {
    alert("Date missing");
    return;
  }

  document.getElementById("dateTitle").innerText = dateParam;

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const history = JSON.parse(localStorage.getItem("attendance_history")) || {};

  const dayData = history[dateParam] || {};  // Only selected day's data

  const tbody = document.getElementById("attendanceTableBody");
  tbody.innerHTML = "";

  students.forEach(student => {
    const record = dayData[student.id];

    let inTime = "-";
    let outTime = "-";
    let status = "Absent";

    if (record) {
      status = record.status || "Present";
      inTime = record.scans?.[0] || "-";
      outTime = record.scans?.[1] || "-";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name || "-"}</td>
      <td>${status}</td>
      <td>${inTime}</td>
      <td>${outTime}</td>
    `;

    tbody.appendChild(tr);
  });
});
