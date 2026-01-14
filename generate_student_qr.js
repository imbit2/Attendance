const students = JSON.parse(localStorage.getItem("students") || "[]");

// DOM references (SAFE)
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

// Generate ID
const next = students.length + 1;
const sid = "STU" + String(next).padStart(4, "0");
studentIdInput.value = sid;

// SAVE BUTTON (FIXED)
document.getElementById("saveBtn").addEventListener("click", () => {

  const student = {
    id: sid,
    name: studentNameInput.value.trim(),
    father: fatherNameInput.value.trim(),
    dob: dobInput.value,
    address: addressInput.value.trim()
  };

  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));

  // Fill PVC card
  card.style.display = "block";
  cardId.innerText = student.id;
  cardName.innerText = student.name;
  cardFather.innerText = student.father;
  cardDob.innerText = student.dob;
  cardAddress.innerText = student.address;

  // Generate QR AFTER SAVE
  qrBox.innerHTML = "";
  new QRCode(qrBox, {
    text: student.id,
    width: 90,
    height: 90
  });

  alert("Student saved & QR generated");
});

function printPVC() {
  if (card.style.display === "none") {
    alert("Please save student first");
    return;
  }
  window.print();
}
