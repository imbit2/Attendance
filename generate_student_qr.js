// ===============================
// Load students from storage
// ===============================
let students = JSON.parse(localStorage.getItem("students") || "[]");

// ===============================
// DOM references
// ===============================
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const fatherNameInput = document.getElementById("fatherName");
const dobInput = document.getElementById("dob");
const addressInput = document.getElementById("address");

const saveBtn = document.getElementById("saveBtn");

const printCard = document.getElementById("printCard");
const cardId = document.getElementById("cardId");
const cardName = document.getElementById("cardName");
const cardFather = document.getElementById("cardFather");
const cardDob = document.getElementById("cardDob");
const cardAddress = document.getElementById("cardAddress");
const qrBox = document.getElementById("qr");

// ===============================
// Read URL parameter
// ===============================
const params = new URLSearchParams(window.location.search);
const existingId = params.get("id");

let currentStudent = null;

// ===============================
// REPRINT MODE
// ===============================
if (existingId) {
  currentStudent = students.find(s => s.id === existingId);

  if (!currentStudent) {
    alert("Student not found");
    window.location.href = "student_list.html";
  }

  // Fill inputs
  studentIdInput.value = currentStudent.id;
  studentNameInput.value = currentStudent.name || "";
  fatherNameInput.value = currentStudent.father || "";
  dobInput.value = currentStudent.dob || "";
  addressInput.value = currentStudent.address || "";

  // Disable editing
  studentIdInput.readOnly = true;
  studentNameInput.readOnly = true;
  fatherNameInput.readOnly = true;
  dobInput.readOnly = true;
  addressInput.readOnly = true;

  studentNameInput.classList.add("readonly");
  fatherNameInput.classList.add("readonly");
  dobInput.classList.add("readonly");
  addressInput.classList.add("readonly");

  saveBtn.innerText = "Reprint ID Card";

  // Show card immediately
  renderCard(currentStudent);
}

// ===============================
// NEW STUDENT MODE
// ===============================
if (!existingId) {
  const next = students.length + 1;
  studentIdInput.value = "STU" + String(next).padStart(4, "0");
  studentIdInput.readOnly = true;
}

// ===============================
// SAVE / REPRINT HANDLER
// ===============================
saveBtn.addEventListener("click", () => {

  // REPRINT ONLY
  if (existingId) {
    renderCard(currentStudent);
    window.print();
    return;
  }

  // NEW STUDENT SAVE
  const student = {
    id: studentIdInput.value,
    name: studentNameInput.value.trim(),
    father: fatherNameInput.value.trim(),
    dob: dobInput.value,
    address: addressInput.value.trim()
  };

  if (!student.name) {
    alert("Student name required");
    studentNameInput.focus();
    return;
  }

  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));

  renderCard(student);
  alert("Student saved & ID card generated");
});

// ===============================
// Render PVC Card
// ===============================
function renderCard(s) {
  printCard.style.display = "block";

  cardId.innerText = s.id;
  cardName.innerText = s.name;
  cardFather.innerText = s.father;
  cardDob.innerText = s.dob;
  cardAddress.innerText = s.address;

  qrBox.innerHTML = "";
  new QRCode(qrBox, {
    text: s.id,
    width: 100,
    height: 100
  });
}

// ===============================
// Print PVC Card
// ===============================
function printPVC() {
  if (printCard.style.display === "none") {
    alert("No ID card to print");
    return;
  }
  window.print();
}
