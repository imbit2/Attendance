// student_list.js

let students = [];
let studentsCache = []; // Used by scan_qr.js

/* LOAD + SYNC STORAGE */
function refreshStudents() {
  students = JSON.parse(localStorage.getItem("students")) || [];
  studentsCache = students; // Keep QR scanner in sync
}

document.addEventListener("DOMContentLoaded", () => {
  refreshStudents();
  renderStudentList(students);

  // Instant live search
  const searchBox = document.getElementById("searchInput");
  if (searchBox) {
    searchBox.addEventListener("input", searchStudent);
  }
});

/* RENDER TABLE */
function renderStudentList(list) {
  if (!Array.isArray(list)) list = [];

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

/* FORCE RELOAD WHEN RETURNING TO PAGE */
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    refreshStudents();
    renderStudentList(students);
  }
});
