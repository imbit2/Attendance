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

// ==========================
// LOAD PAYMENT PAGE
// ==========================
function loadPaymentPage() {
  let studentId = localStorage.getItem("feeSelectedStudent");
  if (!studentId) return;

  let students = getStudents();
  let student = students.find(s => s.id == studentId);

  let currentYear = new Date().getFullYear();
  let fees = getFees();

  // Ensure year exists
  if (!fees[currentYear]) {
    fees[currentYear] = {};
    saveFees(fees);
  }

  // Ensure student record exists
  if (!fees[currentYear][studentId]) {
    fees[currentYear][studentId] = {};
    months.forEach(m => fees[currentYear][studentId][m] = "Due");
    saveFees(fees);
  }

  document.getElementById("studentTitle").textContent = 
    `Fee Payment for: ${student.name}`;

  document.getElementById("yearTitle").textContent = 
    `Year: ${currentYear}`;

  let table = document.getElementById("paymentTable");
  table.innerHTML = "";

  months.forEach(m => {
    let status = fees[currentYear][studentId][m];

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m}</td>
      <td>
        <button class="paid" onclick="setStatus('${studentId}','${m}','Paid')">PAID</button>
        <button class="due" onclick="setStatus('${studentId}','${m}','Due')">DUE</button>
        <div style="margin-top:5px; font-weight:bold;">${status}</div>
      </td>
    `;
    table.appendChild(tr);
  });
}

// ==========================
// UPDATE STATUS
// ==========================
function setStatus(studentId, month, value) {
  let year = new Date().getFullYear();
  let fees = getFees();

  fees[year][studentId][month] = value;
  saveFees(fees);

  loadPaymentPage(); // refresh
}

// ==========================
// GO BACK
// ==========================
function goBack() {
  window.location.href = "fees.html";
}
