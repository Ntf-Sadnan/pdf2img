# pdf2img

Quickly convert your PDF files into high-quality PNG images right in your browser! This tool is designed for simplicity and speed, letting you choose the output quality to balance file size and clarity.

## Features

*   **Client-Side Conversion**: All processing happens in your browser. Your PDFs stay private!
*   **Quality Options**:
    *   **Lowest Quality**: Optimized for smaller file sizes (renders at 1.0x scale, max 1600px dimension).
    *   **High Quality**: Best visual fidelity (renders at 1.5x scale, max 1920px dimension).
*   **PNG Output**: Converts PDF pages to PNG images.
*   **Download All as ZIP**: Conveniently download all converted images in a single ZIP file.
*   **Real-time Progress**: See the conversion progress page by page.
*   **Drag & Drop**: Easily upload your PDF files.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Shadcn/UI
*   **PDF Processing**: `pdfjs-dist`
*   **Image Compression**: `browser-image-compression`
*   **Backend (for dev/hosting)**: Express.js, Node.js

## How to Use

1.  **Upload PDF**: Drag and drop your PDF file onto the upload area, or click to select a file.
2.  **Select Quality**: Choose between "Lowest Quality" or "High Quality" for your PNG images.
3.  **Convert**: The conversion will start automatically.
4.  **Download**: Once done, click "Download All as ZIP".

## Getting Started (for Developers)

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running Locally

*   **Development Mode** (with hot-reloading):
    ```bash
    npm run dev
    ```
    This will start the development server, typically on `http://localhost:5000`.

*   **Production Build & Start**:
    1.  Build the application:
        ```bash
        npm run build
        ```
    2.  Start the production server:
        ```bash
        npm run start
        ```

---

Vibecoded with ❤️ by ntf sadnan.
