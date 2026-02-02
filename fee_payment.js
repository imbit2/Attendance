const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getStudents() {
  return JSON.parse(localStorage.getItem("students") || "[]");
}

function getFees() {
  return JSON.parse(localStorage.getItem("fees") || "{}");
}

function saveFees(data) {
  localStorage.setItem("fees", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
  loadPaymentPage();
});

// Load Payment Page
function loadPaymentPage() {
  let studentId = localStorage.getItem("feeSelectedStudent");
  if (!studentId) return;

  let students = getStudents();
  let student = students.find(s => s.id == studentId);

  let currentYear = new Date().getFullYear();
  let fees = getFees();

  if (!fees[currentYear]) fees[currentYear] = {};
  if (!fees[currentYear][studentId]) {
    fees[currentYear][studentId] = {};
    months.forEach(m => fees[currentYear][studentId][m] = "Due");
    saveFees(fees);
  }

  document.getElementById("studentID").textContent =
    `Student ID: ${student.id}`;
  document.getElementById("studentTitle").textContent =
    `Fee Payment for: ${student.name}`;
  document.getElementById("yearTitle").textContent =
    `Year: ${currentYear}`;

  let table = document.getElementById("paymentTable");
  table.innerHTML = "";

  months.forEach(month => {
    let status = fees[currentYear][studentId][month];

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${month}</td>

      <td>
      <div class="mark-buttons">
        <button class="tick" onclick="setStatus('${studentId}','${month}','Paid')">✔</button>
        <button class="cross" onclick="setStatus('${studentId}','${month}','Due')">✖</button>
        </div>
      </td>

      <td>
        <span class="status-box ${status === "Paid" ? "paid-box" : "due-box"}">
          ${status}
        </span>
      </td>
    `;

    table.appendChild(row);
  });
}

// Update status
function setStatus(studentId, month, value) {
  let year = new Date().getFullYear();
  let fees = getFees();

  fees[year][studentId][month] = value;
  saveFees(fees);

  loadPaymentPage();
}


