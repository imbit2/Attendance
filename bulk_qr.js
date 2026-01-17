let generatedIds = [];

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
    qrDiv.className = "qr-wrap";

    box.appendChild(idDiv);
    box.appendChild(qrDiv);
    qrGrid.appendChild(box);

    new QRCode(qrDiv, {
      text: studentId,
      width: 76,   // ≈ 2cm
      height: 102  // ≈ 2.7cm
    });
  }

  localStorage.setItem("lastPTCId", last + count);
}

async function exportPDF() {
  if (generatedIds.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const boxes = document.querySelectorAll(".qr-box");

  /* A4 SAFE SETTINGS */
  const startX = 10;
  const startY = 10;
  const boxW = 30;   // cut box width
  const boxH = 40;   // cut box height
  const qrW = 24;
  const qrH = 32;
  const gapX = 6;
  const gapY = 8;
  const cols = 5;

  let x = startX;
  let y = startY;
  let col = 0;

  for (let i = 0; i < boxes.length; i++) {
    const canvas = await html2canvas(boxes[i], {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    const img = canvas.toDataURL("image/png");

    /* CUT BORDER */
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, boxW, boxH);

    /* CENTER QR IMAGE */
    const imgX = x + (boxW - qrW) / 2;
    const imgY = y + (boxH - qrH) / 2;

    pdf.addImage(img, "PNG", imgX, imgY, qrW, qrH);

    col++;
    x += boxW + gapX;

    if (col === cols) {
      col = 0;
      x = startX;
      y += boxH + gapY;

      if (y + boxH > 287) {
        pdf.addPage();
        y = startY;
      }
    }
  }

  pdf.save("PTC_QR_A4_Print_Aligned.pdf");
}
