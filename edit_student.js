const params = new URLSearchParams(location.search);
const studentId = params.get("id");

const students = JSON.parse(localStorage.getItem("students") || "[]");
const attendance = JSON.parse(localStorage.getItem("attendance") || "{}");

const student = students.find(s => s.id === studentId);

if (!student) {
  alert("Student not found");
  location.href = "student_list.html";
}

// fill fields
document.getElementById("studentId").value = student.id;
document.getElementById("studentName").value = student.name;
document.getElementById("studentGuardian").value = student.guardian;
document.getElementById("studentDob").value = student.dob;
document.getElementById("studentAddress").value = student.address;
document.getElementById("studentBelt").value = student.belt;
document.getElementById("studentPhone").value = student.phone;

// update student
function updateStudent() {
  student.name = studentName.value.trim();
  student.guardian = studentGaurdian.value.trim();
  student.dob = studentDob.value;
  student.address = studentAddress.value.trim();
  student.belt = studentBelt.value.trim();
  student.phone = studentPhone.value.trim();

  localStorage.setItem("students", JSON.stringify(students));
  alert("Student updated successfully");
}

// attendance history
function showHistory() {
  let html = "<h3>Attendance History</h3>";
  let found = false;

  for (let date in attendance) {
    if (attendance[date][student.id]) {
      found = true;
      html += `<p>${date} : ${attendance[date][student.id]}</p>`;
    }
  }

  if (!found) html += "<p>No attendance record found</p>";
  history.innerHTML = html;
}

// reprint ID card
function reprintCard() {
  location.href = "generate_student_qr.html?id=" + student.id;
}

