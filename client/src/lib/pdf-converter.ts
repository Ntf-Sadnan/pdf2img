// client/src/lib/pdf-converter.ts
import * as PDFJS from 'pdfjs-dist';
import type { ProcessedImage } from "@/pages/home";
import { compressImage } from "@/lib/image-compressor";

// Define the interface for conversion options
interface ConversionOptions {
  pdfScale: number; // Scale factor for PDF.js rendering
  maxImageDimension: number; // Max width or height for image compression
}

// Initialize PDF.js worker
const setupWorker = async () => {
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();
  PDFJS.GlobalWorkerOptions.workerSrc = workerUrl;
};

export async function convertPdfToImages(
  file: File,
  onProgress: (current: number, total: number) => void,
  options: ConversionOptions // Now takes a structured options object
): Promise<ProcessedImage[]> {
  // Ensure worker is set up
  await setupWorker();

  const { pdfScale, maxImageDimension } = options;

  // Read the file
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdf = await PDFJS.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;

  const images: ProcessedImage[] = [];

  // Convert each page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Use the selected pdfScale for rendering the PDF page to canvas.
    const viewport = page.getViewport({ scale: pdfScale });

    // Prepare canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page to canvas as PNG (lossless capture of rendered pixels)
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    const originalDataUrl = canvas.toDataURL('image/png');

    // Compress the image. maxImageDimension will reduce dimensions if needed.
    const compressedDataUrl = await compressImage(originalDataUrl, {
      maxWidthOrHeight: maxImageDimension,
    });

    images.push({
      pageNumber: pageNum,
      dataUrl: compressedDataUrl,
      compressed: true
    });

    onProgress(pageNum, numPages);
  }

  return images;
}