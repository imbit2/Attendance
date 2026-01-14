const students = JSON.parse(localStorage.getItem("students") || "[]");

// DOM refs
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const fatherNameInput = document.getElementById("fatherName");
const dobInput = document.getElementById("dob");
const addressInput = document.getElementById("address");

const card = document.getElementById("printCard");
const cardId = document.getElementById("cardId");
const cardName = document.getElementById("cardName");
const cardFather = document.getElementById("cardFather");
const cardDob = document.getElementById("cardDob");
const cardAddress = document.getElementById("cardAddress");
const qrBox = document.getElementById("qr");

const saveBtn = document.getElementById("saveBtn");

// read URL param
const params = new URLSearchParams(location.search);
const existingId = params.get("id");

let currentStudent = null;

/* ===============================
   EXISTING STUDENT (REPRINT MODE)
================================ */
if (existingId) {
  currentStudent = students.find(s => s.id === existingId);

  if (!currentStudent) {
    alert("Student not found");
    location.href = "student_list.html";
  }

  // fill inputs
  studentIdInput.value = currentStudent.id;
  studentNameInput.value = currentStudent.name;
  fatherNameInput.value = currentStudent.father;
  dobInput.value = currentStudent.dob;
  addressInput.value = currentStudent.address;

  // lock ID
  studentIdInput.readOnly = true;

  // show card
  showCard(currentStudent);

  // change button text
  saveBtn.innerText = "Update Student";

}
/* ===============================
   NEW STUDENT MODE
================================ */
else {
  const next = students.length + 1;
  const sid = "STU" + String(next).padStart(4, "0");
  studentIdInput.value = sid;
}

/* ===============================
   SAVE / UPDATE
================================ */
saveBtn.addEventListener("click", () => {

  if (existingId) {
    // UPDATE EXISTING
    currentStudent.name = studentNameInput.value.trim();
    currentStudent.father = fatherNameInput.value.trim();
    currentStudent.dob = dobInput.value;
    currentStudent.address = addressInput.value.trim();

    localStorage.setItem("students", JSON.stringify(students));
    showCard(currentStudent);
    alert("Student updated");

  } else {
    // SAVE NEW
    const student = {
      id: studentIdInput.value,
      name: studentNameInput.value.trim(),
      father: fatherNameInput.value.trim(),
      dob: dobInput.value,
      address: addressInput.value.trim()
    };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
    showCard(student);
    alert("Student saved & QR generated");
  }
});

/* ===============================
   SHOW PVC CARD
================================ */
function showCard(student) {
  card.style.display = "block";

  cardId.innerText = student.id;
  cardName.innerText = student.name;
  cardFather.innerText = student.father;
  cardDob.innerText = student.dob;
  cardAddress.innerText = student.address;

  qrBox.innerHTML = "";
  new QRCode(qrBox, {
    text: student.id,
    width: 90,
    height: 90
  });
}

function printPVC() {
  if (card.style.display === "none") {
    alert("No card to print");
    return;
  }
  window.print();
}
