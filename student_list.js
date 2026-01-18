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
      <td>${student.id}</td>
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

/* SEARCH 
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
}*/
