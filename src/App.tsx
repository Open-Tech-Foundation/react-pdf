import PdfViewer from "./lib/PDF";

function App() {
  const pdfUrl = '/sample.pdf';

  return (
    <div>
      <h3>React PDF</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 50% 1fr" }}>
        <div />
        <PdfViewer file={pdfUrl} />
        <div />
      </div>
    </div>
  );
}

export default App;
