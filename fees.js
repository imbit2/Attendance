function getStudents() {
  return JSON.parse(localStorage.getItem("students") || "[]");
}

function getFees() {
  return JSON.parse(localStorage.getItem("fees") || "{}");
}

function saveFees(data) {
  localStorage.setItem("fees", JSON.stringify(data));
}

// Months
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

document.addEventListener("DOMContentLoaded", () => {
  loadYearDropdown();
  loadStudentTable();
});

// =========================
// YEAR HANDLING
// =========================
function loadYearDropdown() {
  let dropdown = document.getElementById("yearDropdown");
  let currentYear = new Date().getFullYear();
  let fees = getFees();

  // Auto add year if missing
  if (!fees[currentYear]) {
    fees[currentYear] = {};
    saveFees(fees);
  }

  dropdown.innerHTML = "";

  // Add all existing years
  Object.keys(fees).forEach(year => {
    let opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    dropdown.appendChild(opt);
  });

  dropdown.value = currentYear;

  dropdown.addEventListener("change", () => {
    autoCreateYear(dropdown.value);
    loadStudentTable();
  });
}

function autoCreateYear(year) {
  let fees = getFees();
  if (!fees[year]) {
    fees[year] = {};
    saveFees(fees);
  }
}

// =========================
// STUDENT TABLE
// =========================
function loadStudentTable() {
  let tbody = document.querySelector("#feesTable tbody");
  tbody.innerHTML = "";

  let students = getStudents();
  let year = document.getElementById("yearDropdown").value;

  let fees = getFees();
  if (!fees[year]) {
    fees[year] = {};
    saveFees(fees);
  }

  students.forEach(stu => {
    if (!stu.name || stu.name.trim() === "") return;

    // ensure fee record exists
    if (!fees[year][stu.id]) {
      fees[year][stu.id] = {};
      months.forEach(m => {
        fees[year][stu.id][m] = "Due"; // default
      });
      saveFees(fees);
    }

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${stu.id}</td>
      <td>${stu.name}</td>
      <td>
        <button onclick="openFeePayment('${stu.id}')">Manage</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================
// OPEN PAYMENT PAGE
// =========================
function openFeePayment(studentId) {
  localStorage.setItem("feeSelectedStudent", studentId);
  window.location.href = "fee_payment.html"; // you will create later
}

// =========================
// EXCEL EXPORT
// =========================
function exportFeesExcel() {
  let year = document.getElementById("yearDropdown").value;
  let fees = getFees()[year];
  let students = getStudents();

  let rows = [];

  rows.push([
    "Student ID","Name","Jan","Feb","Mar","Apr","May",
    "Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ]);

  students.forEach(stu => {
    if (!stu.name.trim()) return;

    let row = [stu.id, stu.name];

    months.forEach(m => {
      let status = fees[stu.id][m];
      row.push(status);
    });

    rows.push(row);
  });

  // Convert to CSV for now (simple export)
  let csv = rows.map(r => r.join(",")).join("\n");

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `Fees_${year}.csv`;
  a.click();
}
