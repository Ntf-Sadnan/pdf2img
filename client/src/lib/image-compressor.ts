// client/src/lib/image-compressor.ts
import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number; // max file size in MB. Can be Infinity.
  maxWidthOrHeight?: number; // max width or height in pixels. Can be Infinity.
  useWebWorker?: boolean; // use web worker for compression. Defaults to true.
}

export async function compressImage(
  dataUrl: string,
  options?: CompressionOptions
): Promise<string> {
  // Convert data URL (which is always PNG from canvas initially) to File object
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], "image.png", { type: "image/png" });

  // Default compression options for PNG, focusing on max dimensions
  const defaultCompressionOptions: imageCompression.Options = {
    maxSizeMB: Infinity,        // Do not enforce a max size, dimensions will dictate
    maxWidthOrHeight: 1920,     // Default max dimension if not provided (e.g., 1920 for Full HD width)
    useWebWorker: true,
    fileType: 'image/png',      // Force PNG output
    ...options,                 // Merge with options provided from UI (e.g., maxWidthOrHeight)
  };

  try {
    const compressedFile = await imageCompression(file, defaultCompressionOptions);
    return await imageCompression.getDataUrlFromFile(compressedFile);
  } catch (error) {
    console.error('Compression failed, returning original image dataUrl:', error);
    return dataUrl; // Return original if compression fails
  }
}