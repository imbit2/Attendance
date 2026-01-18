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
}

async function exportPNG() {
  const qrGrid = document.getElementById("qrGrid");

  if (!qrGrid || qrGrid.children.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  const canvas = await html2canvas(qrGrid, {
    backgroundColor: "#ffffff",
    scale: 3   // higher = sharper image
  });

  const imgData = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = imgData;
  link.download = "PTC_Bulk_QR.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

