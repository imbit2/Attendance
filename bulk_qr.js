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
      width: 80,
      height: 108
    });
  }

  localStorage.setItem("lastPTCId", last + count);
}

/* =========================
   EXPORT CSV
========================= */
function exportCSV() {
  if (generatedIds.length === 0) {
    alert("Generate QR codes first");
    return;
  }

  let csv = "Student ID,QR Value,Generated On\n";
  const now = new Date().toLocaleString();

  generatedIds.forEach(id => {
    csv += `${id},${id},${now}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "PTC_Bulk_QR_List.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
