// client/src/pages/home.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import PdfUpload from "@/components/pdf-upload";
import ConversionProgress from "@/components/conversion-progress";
import DownloadZipButton from "@/components/download-zip-button";

export type ProcessedImage = {
  pageNumber: number;
  dataUrl: string;
  compressed: boolean;
};

export default function Home() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  return (
    // Centering the whole page content without a sidebar
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-8">
      <main className="w-full max-w-xl space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">pdf2img</h1>
          <PdfUpload
            onImagesGenerated={setImages}
            onProgressUpdate={setProgress}
          />
        </Card>

        {progress.total > 0 && (
          <Card className="p-6">
            <ConversionProgress current={progress.current} total={progress.total} />
          </Card>
        )}

        {images.length > 0 && (
          <Card className="p-6 flex justify-center">
            <DownloadZipButton images={images} />
          </Card>
        )}
      </main>
      <div className="pt-2 text-gray-400">
          Created by <a className="text-black/60" href="https://github.com/ntf-sadnan" target="_blank" rel="noopener noreferrer">Ntf Sadnan</a>
      </div>
    </div>
  );
}