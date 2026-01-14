<!DOCTYPE html>
<html>
<head>
  <title>Generate Student QR</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
</head>
<body>

<h2>Generate Student QR</h2>

<div class="card">
  <label>Student ID</label>
  <input id="studentId" readonly>

  <label>Student Name</label>
  <input id="studentName">

  <label>Father's Name</label>
  <input id="fatherName">

  <label>DOB</label>
  <input type="date" id="dob">

  <label>Address</label>
  <input id="address">
</div>

<!-- PVC CARD -->
<div class="pvc-card" id="printCard" style="display:none;">
  <div class="card-header">
    <div class="school-name">ABC COACHING CENTRE</div>
    <div class="card-title">STUDENT ID CARD</div>
  </div>

  <div class="card-body">
    <div class="student-info">
      <div><b>ID:</b> <span id="cardId"></span></div>
      <div><b>Name:</b> <span id="cardName"></span></div>
      <div><b>Father:</b> <span id="cardFather"></span></div>
      <div><b>DOB:</b> <span id="cardDob"></span></div>
      <div><b>Address:</b> <span id="cardAddress"></span></div>
    </div>
    <div class="qr-area" id="qr"></div>
  </div>

  <div class="card-footer">Valid for Academic Use Only</div>
</div>

<button id="saveBtn">Save Student</button>
<button onclick="printPVC()">Print PVC Card</button>

<script src="generate_student_qr.js"></script>
</body>
</html>
