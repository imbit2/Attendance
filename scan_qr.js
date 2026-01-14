const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (text) => {
    document.getElementById("beep").play();
    window.opener.markPresentFromQR(text);
  }
);
