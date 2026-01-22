let generatedIds = [];

/* =========================
   GENERATE BULK QR
========================= */
function generateBulk() {
  const count = parseInt(document.getElementById("qrCount").value);
  if (!count) {
    alert("Please select quantity");
    return;
  }

  let last = localStorage.getItem("lastPTCId");
  last = last ? parseInt(last) : 0;

  const qrGrid = document.getElementById("qrGrid");
  qrGrid.innerHTML = "";
  generatedIds = [];

  for (let i = 1; i <= count; i++) {
    const num = last + i;
    const studentId = "PTC" + String(num).padStart(4, "0");
    generatedIds.push(studentId);

    const box = document.createElement("div");
    box.className = "qr-box";

    const idDiv = document.createElement("div");
    idDiv.className = "qr-id";
    idDiv.innerText = studentId;

    const qrDiv = document.createElement("div");
    qrDiv.className = "qr-container";

    box.appendChild(idDiv);
    box.appendChild(qrDiv);
    qrGrid.appendChild(box);

     const qrValue = `${studentId}|https://imbit2.github.io/Attendance/student_profile.html?id=${studentId}`;

new QRCode(qrDiv, {
  text: qrValue,
  width: 76,
  height: 76,
  correctLevel: QRCode.CorrectLevel.H
});

    /* new QRCode(qrDiv, {
      text: studentId,
      width: 76,
      height: 76,
      correctLevel: QRCode.CorrectLevel.H
    }); */
  }

  localStorage.setItem("lastPTCId", last + count);
  saveGeneratedIdsToStudents(generatedIds);
}

/* =========================
   EXPORT PNG (SAFE)
========================= */
async function exportPNG() {
  const qrGrid = document.getElementById("qrGrid");

  if (!qrGrid || qrGrid.children.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const canvas = await html2canvas(qrGrid, {
    backgroundColor: "#ffffff",
    scale: 2
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "PTC_Bulk_QR.png";
  link.click();
}

/* =========================
   EXPORT PDF (FIXED ALIGNMENT)
========================= */
async function exportPDF() {
  if (generatedIds.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const cards = document.querySelectorAll(".qr-box");

  const cardW = 20;   // mm
  const cardH = 27;   // mm
  const qrSize = 16;  // mm

  const marginX = 10;
  const marginY = 10;
  const gapX = 4;
  const gapY = 6;
  const maxCols = 7;

  let x = marginX;
  let y = marginY;
  let col = 0;

  for (let i = 0; i < cards.length; i++) {
    const qrCanvas = cards[i].querySelector("canvas, img");
    if (!qrCanvas) continue;

    const qrImg =
      qrCanvas.tagName === "CANVAS"
        ? qrCanvas.toDataURL("image/png")
        : qrCanvas.src;

    const idText = generatedIds[i];

    /* CUT BORDER */
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, cardW, cardH);

    /* ID */
    pdf.setFontSize(8);
    pdf.text(idText, x + cardW / 2, y + 5, { align: "center" });

    /* QR (CENTERED, NO DISTORTION) */
    pdf.addImage(
      qrImg,
      "PNG",
      x + (cardW - qrSize) / 2,
      y + 8,
      qrSize,
      qrSize
    );

    col++;
    x += cardW + gapX;

    if (col === maxCols) {
      col = 0;
      x = marginX;
      y += cardH + gapY;

      if (y + cardH > 280) {
        pdf.addPage();
        y = marginY;
      }
    }
  }

  pdf.save("PTC_QR_A4_Print.pdf");
}

/* =========================
   SAVE TO STUDENT LIST
========================= */
function saveGeneratedIdsToStudents(ids) {
  let students = JSON.parse(localStorage.getItem("students")) || [];

  ids.forEach(id => {
    if (!students.some(s => s.id === id)) {
      students.push({
        id,
        name: "",
        guardian: "",
        dob: "",
        address: "",
        belt: "",
        phone: ""
      });
    }
  });

  localStorage.setItem("students", JSON.stringify(students));
}


/*let generatedIds = [];

function generateBulk() {
  const count = parseInt(document.getElementById("qrCount").value);
  if (!count) {
    alert("Please select quantity");
    return;
  }

  let last = localStorage.getItem("lastPTCId");
  last = last ? parseInt(last) : 0;

  const qrGrid = document.getElementById("qrGrid");
  qrGrid.innerHTML = "";
  generatedIds = [];

  for (let i = 1; i <= count; i++) {
    const num = last + i;
    const studentId = "PTC" + String(num).padStart(4, "0");

    generatedIds.push(studentId);

    const box = document.createElement("div");
    box.className = "qr-box";

    const idDiv = document.createElement("div");
    idDiv.className = "qr-id";
    idDiv.innerText = studentId;

    const qrDiv = document.createElement("div");
    qrDiv.className = "qr-container";

    box.appendChild(idDiv);
    box.appendChild(qrDiv);
    qrGrid.appendChild(box);

    new QRCode(qrDiv, {
  text: studentId,
  width: 76,
  height: 76,
  correctLevel: QRCode.CorrectLevel.H
  });
  }

  localStorage.setItem("lastPTCId", last + count);
  
  saveGeneratedIdsToStudents(generatedIds);
}

async function exportPNG() {
  const qrGrid = document.getElementById("qrGrid");

  if (!qrGrid || qrGrid.children.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const canvas = await html2canvas(qrGrid, {
    backgroundColor: "#ffffff",
    scale: 2   // higher = sharper image
  });

  const imgData = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imgData;
  link.download = "PTC_Bulk_QR.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
async function exportPDF() {
  if (generatedIds.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const cards = document.querySelectorAll(".qr-box");

  const cardW = 20;
  const cardH = 27;
  const qrSize = 16;

  let x = 10;
  let y = 10;
  let col = 0;

  for (let i = 0; i < cards.length; i++) {
    const qrCanvas = cards[i].querySelector("canvas");
    const qrImg = qrCanvas.toDataURL("image/png");

    const idText = generatedIds[i];

    /* CUT BORDER 
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, cardW, cardH);

    /* ID TEXT 
    pdf.setFontSize(8);
    pdf.text(idText, x + cardW / 2, y + 5, { align: "center" });

    /* QR IMAGE (NO DISTORTION) 
    pdf.addImage(
      qrImg,
      "PNG",
      x + (cardW - qrSize) / 2,
      y + 7,
      qrSize,
      qrSize
    );

    col++;
    x += cardW + 4;

    if (col === 7) {
      col = 0;
      x = 10;
      y += cardH + 6;

      if (y + cardH > 280) {
        pdf.addPage();
        y = 10;
      }
    }
  }

  pdf.save("PTC_QR_A4_Print.pdf");
}

function saveGeneratedIdsToStudents(ids) {
  let students = JSON.parse(localStorage.getItem("students")) || [];

  ids.forEach(id => {
    const exists = students.some(s => s.id === id);
    if (!exists) {
      students.push({
        id: id,
        name: "",
        guardian: "",
        dob: "",
        address: "",
        belt: "",
        phone: ""
      });
    }
  });

  localStorage.setItem("students", JSON.stringify(students));
}*/





