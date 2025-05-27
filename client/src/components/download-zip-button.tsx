// client/src/components/download-zip-button.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import type { ProcessedImage } from "@/pages/home";
import JSZip from "jszip";

interface DownloadZipButtonProps {
  images: ProcessedImage[];
}

export default function DownloadZipButton({ images }: DownloadZipButtonProps) {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const downloadAllAsZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Add each image to the zip
      images.forEach((image) => {
        const imageData = image.dataUrl.split(',')[1];
        zip.file(`page-${image.pageNumber}.png`, imageData, { base64: true }); // Always save as PNG
      });

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "converted-images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating zip:', error);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        variant="secondary"
        onClick={downloadAllAsZip}
        disabled={isDownloadingZip || images.length === 0}
        className="w-full sm:w-auto"
      >
        <Archive className="h-4 w-4 mr-2" />
        {isDownloadingZip ? "Creating ZIP..." : "Download All as ZIP"}
      </Button>
      {images.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {images.length} page{images.length !== 1 ? 's' : ''} converted to PNG.
          </p>
      )}
    </div>
  );
}