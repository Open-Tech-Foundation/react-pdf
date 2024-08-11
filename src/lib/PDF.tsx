import { useEffect, useRef, useState } from "react";
import * as PDFJS from "pdfjs-dist/build/pdf.mjs";

import "./styles.css";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.mjs`;

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  // const annotationLayerRef = useRef(null);
  const [textItems, setTextItems] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadPdf = async () => {
      if (!file) return;

      const loadingTask = PDFJS.getDocument(file);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      // const annotationCanvas = annotationLayerRef.current;
      // const annotationContext = annotationCanvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      setSize({ width: viewport.width, height: viewport.height });

      // annotationCanvas.height = viewport.height;
      // annotationCanvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Extract text
      const textContent = await page.getTextContent();

      const txtLayer = new PDFJS.TextLayer({
        textContentSource: textContent,
        container: textLayerRef.current,
        viewport,
      });
      await txtLayer.render();
    };

    loadPdf();
  }, []);

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) =>
      numPages ? Math.min(prevPageNumber + 1, numPages) : prevPageNumber
    );
  };

  return (
    <div>
      <div>
        <button disabled={pageNumber <= 1} onClick={goToPrevPage}>
          Previous
        </button>
        <span>
          {" "}
          Page {pageNumber} of {numPages}{" "}
        </span>
        <button disabled={pageNumber >= numPages} onClick={goToNextPage}>
          Next
        </button>
        <button onClick={() => addHighlight(100, 150, 200, 50)}>
          Add Highlight
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef}></canvas>
        <div
          ref={textLayerRef}
          className="textLayer"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // width: size.width,
            // height: size.height,
            "--scale-factor": 1,
          }}
        >
          {/* {textItems} */}
        </div>
        {/* <canvas
          ref={annotationLayerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        ></canvas> */}
      </div>
    </div>
  );
};

export default PdfViewer;
