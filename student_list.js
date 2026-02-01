// student_list.js

let students = [];
let studentsCache = []; // Faster global cache for scan_qr.js

document.addEventListener("DOMContentLoaded", () => {
  students = JSON.parse(localStorage.getItem("students")) || [];
  studentsCache = students; // Make cache available for scanner
  renderStudentList(students);
});

/* RENDER TABLE */
function renderStudentList(list) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No students found</td></tr>`;
    return;
  }

  list.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <a href="student_profile.html?id=${student.id}" 
           target="_blank"
           style="font-weight:600; color:#3498db; text-decoration:none;">
          ${student.id}
        </a>
      </td>

      <td>${student.name || "-"}</td>

      <td>
        <a href="edit_student.html?id=${student.id}" class="small-btn">
          Edit
        </a>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* SEARCH FUNCTION */
function searchStudent() {
  const q = document.getElementById("searchInput").value.toLowerCase();

  const filtered = students.filter(s =>
    s.id.toLowerCase().includes(q) ||
    (s.name || "").toLowerCase().includes(q)
  );

  renderStudentList(filtered);
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  renderStudentList(students);
}

/* FORCE RELOAD ON BACK BUTTON */
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
