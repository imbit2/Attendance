// student_list.js

let students = [];

document.addEventListener("DOMContentLoaded", () => {
  students = JSON.parse(localStorage.getItem("students")) || [];
  renderStudentList(students);
});

function renderStudentList(list) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No students found</td></tr>`;
    return;
  }

  list.forEach((student, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.id}</td>
      <td>${student.name || "-"}</td>
    `;

    tr.onclick = () => {
      window.location.href = `edit_student.html?id=${student.id}`;
    };

    tbody.appendChild(tr);
  });
}

/* SEARCH */
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


/*let students = [];

// Load students on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedStudents = localStorage.getItem("students");
  students = storedStudents ? JSON.parse(storedStudents) : [];
  renderStudentList(students);
});

// Render student list
function renderStudentList(list) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;">No students found</td>
      </tr>
    `;
    return;
  }

  list.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
          ${student.id}
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

// 🔍 Search student
function searchStudent() {
  const keyword = document
    .getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

  if (!keyword) {
    renderStudentList(students);
    return;
  }

  const filtered = students.filter(student =>
    student.id.toLowerCase().includes(keyword) ||
    (student.name && student.name.toLowerCase().includes(keyword))
  );

  renderStudentList(filtered);
}

// ❌ Clear search
function clearSearch() {
  document.getElementById("searchInput").value = "";
  renderStudentList(students);
}*/

