let generatedIds = [];

function generateBulk() {
  const count = parseInt(document.getElementById("qrCount").value);

  if (!count || count <= 0) {
    alert("Please select how many QR codes to generate");
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

    /* QR BOX */
    const box = document.createElement("div");
    box.className = "qr-box";

    /* TABLE */
    const table = document.createElement("table");
    table.className = "qr-table";

    /* ROW 1: STUDENT ID */
    const row1 = document.createElement("tr");
    const idCell = document.createElement("td");
    idCell.className = "qr-id";
    idCell.innerText = studentId;
    row1.appendChild(idCell);

    /* ROW 2: QR CODE */
    const row2 = document.createElement("tr");
    const qrCell = document.createElement("td");
    qrCell.className = "qr-cell";
    row2.appendChild(qrCell);

    table.appendChild(row1);
    table.appendChild(row2);
    box.appendChild(table);
    qrGrid.appendChild(box);

    /* GENERATE QR */
    new QRCode(qrCell, {
      text: studentId,
      width: 80,
      height: 80,
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  localStorage.setItem("lastPTCId", last + count);
}

/* =========================
   EXPORT PDF (A4 – CUT SAFE)
========================= */
async function exportPDF() {
  if (generatedIds.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const boxes = document.querySelectorAll(".qr-box");

  let x = 10;
  let y = 10;
  let col = 0;

  for (let i = 0; i < boxes.length; i++) {
    const canvas = await html2canvas(boxes[i], {
      scale: 3,
      backgroundColor: "#ffffff"
    });

    const img = canvas.toDataURL("image/png");

    /* CUT BORDER */
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, 20, 27);

    /* QR CARD IMAGE */
    pdf.addImage(img, "PNG", x, y, 20, 27);

    col++;
    x += 24;

    if (col === 7) {
      col = 0;
      x = 10;
      y += 32;

      if (y > 260) {
        pdf.addPage();
        y = 10;
      }
    }
  }

  pdf.save("PTC_Bulk_QR_A4.pdf");
}
