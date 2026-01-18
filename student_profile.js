const params = new URLSearchParams(location.search);
const studentId = params.get("id");

if (!studentId) {
  alert("Invalid Student");
  window.close();
}

const students = JSON.parse(localStorage.getItem("students") || "[]");
const student = students.find(s => s.id === studentId);

if (!student) {
  alert("Student not found");
  window.close();
}

/* Fill data */
pId.innerText = student.id;
pName.innerText = student.name || "-";
pGuardian.innerText = student.guardian || "-";
pDob.innerText = student.dob || "-";
pBelt.innerText = student.belt || "-";
pAddress.innerText = student.address || "-";
pPhone.innerText = student.phone || "-";

qrText.innerText = student.id;

/* Generate QR */
new QRCode(document.getElementById("qrBox"), {
  text: student.id,
  width: 120,
  height: 120,
  correctLevel: QRCode.CorrectLevel.H
});
