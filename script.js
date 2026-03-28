let pdfDoc = null;
let canvas = document.getElementById("pdfCanvas");
let ctx = canvas.getContext("2d");
let uploadedBytes = null;

document.getElementById("upload").addEventListener("change", async (e) => {

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    uploadedBytes = new Uint8Array(this.result);

    pdfDoc = await pdfjsLib.getDocument({ data: uploadedBytes }).promise;
    renderPage(1);
  };

  reader.readAsArrayBuffer(file);
});

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: 1.5 });

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: ctx,
    viewport: viewport
  }).promise;
}

async function addText() {
  const text = document.getElementById("textInput").value;

  const pdfDocLib = await PDFLib.PDFDocument.load(uploadedBytes);
  const page = pdfDocLib.getPages()[0];

  page.drawText(text, {
    x: 50,
    y: 500,
    size: 24
  });

  uploadedBytes = await pdfDocLib.save();
  alert("Text added!");
}

function downloadPDF() {
  const blob = new Blob([uploadedBytes], { type: "application/pdf" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "FISA_edited.pdf";
  link.click();
}
