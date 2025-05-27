// client/src/components/pdf-upload.tsx
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { convertPdfToImages } from "@/lib/pdf-converter"; // Updated import path to get new function signature
import type { ProcessedImage } from "@/pages/home";

// Import UI components for controls
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Import ToggleGroup

interface PdfUploadProps {
  onImagesGenerated: (images: ProcessedImage[]) => void;
  onProgressUpdate: (progress: { current: number; total: number }) => void;
}

// Define the quality options
const QUALITY_OPTIONS = {
  lowest: {
    label: "Lowest Quality",
    pdfScale: 1.0,
    maxImageDimension: 1600,
  },
  high: {
    label: "High Quality",
    pdfScale: 1.5,
    maxImageDimension: 1920,
  },
};

type QualityOptionKey = keyof typeof QUALITY_OPTIONS;

export default function PdfUpload({ onImagesGenerated, onProgressUpdate }: PdfUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<QualityOptionKey>('high'); // Default to high quality

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setError(null);
      onProgressUpdate({ current: 0, total: 0 }); // Reset progress on new upload

      const options = QUALITY_OPTIONS[selectedQuality];

      const images = await convertPdfToImages(
        file,
        (current, total) => {
          onProgressUpdate({ current, total });
        },
        options // Pass the selected options
      );

      onImagesGenerated(images);
    } catch (err) {
      console.error("PDF processing error:", err);
      setError(err instanceof Error ? err.message : "Failed to process PDF");
    }
  }, [onImagesGenerated, onProgressUpdate, selectedQuality]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF, or click to select"}
        </p>
        <Button variant="secondary" className="mt-4">
          Select PDF
        </Button>
      </div>

      {/* Quality Selection Buttons */}
      <div className="space-y-2">
        <Label>Output Quality (PNG)</Label>
        <ToggleGroup
          type="single"
          value={selectedQuality}
          onValueChange={(value: QualityOptionKey) => {
            if (value) setSelectedQuality(value); // Only update if value is not null/undefined
          }}
          className="flex justify-center md:justify-start"
        >
          <ToggleGroupItem value="lowest" aria-label="Toggle lowest quality">
            {QUALITY_OPTIONS.lowest.label}
          </ToggleGroupItem>
          <ToggleGroupItem value="high" aria-label="Toggle high quality">
            {QUALITY_OPTIONS.high.label}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground">
          Highest quality options result in larger file sizes. Lowest quality options result in smaller file sizes. 
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}