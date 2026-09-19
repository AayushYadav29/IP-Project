# PhotoRevive – Old Photo Restoration Tool

> **Academic Mini-Project**  
> **Course:** MSc-IT – Semester 1  
> **Subject:** Image Processing  

---

## 1. Introduction

**PhotoRevive** is a client-side web application dedicated to restoring and enhancing old, faded, noisy, or damaged photographs using fundamental digital image processing techniques. The entire image processing pipeline runs directly in the client's web browser using **OpenCV.js** (WebAssembly) and the **HTML5 Canvas API**.

Unlike modern deep-learning "black box" systems, PhotoRevive relies purely on deterministic, classical image processing algorithms. This makes every operation transparent, reproducible, and well-suited for academic study, evaluation, and viva presentations.

---

## 2. Project Objectives

- Provide an intuitive, mobile-first web interface for uploading and restoring vintage photographs.
- Implement an automated end-to-end pipeline combining denoising, contrast correction, and detail sharpening.
- Offer granular manual controls for fine-tuning restoration parameters (Noise, Brightness, Contrast, Sharpness).
- Demonstrate practical applications of classical image processing concepts such as:
  - Bilateral Filtering
  - CLAHE (Contrast Limited Adaptive Histogram Equalization)
  - Unsharp Masking
  - Morphological Operations & Inpainting
  - Tonal Mapping
- Preserve the original photograph without destruction while providing real-time before/after interactive comparisons.
- Ensure all processing takes place locally in the browser with zero backend dependency, no cloud APIs, and complete user privacy.

---

## 3. Features

1. **✨ Auto Restore**
   - Applies an optimized combination of LAB CLAHE contrast enhancement, edge-preserving bilateral filtering, unsharp mask sharpening, and subtle tone correction in a single click.
2. **Noise Reduction (0–100)**
   - Utilizes Bilateral Filtering (`cv.bilateralFilter`) to smooth out film grain and sensor noise while preserving sharp edges, falling back to Gaussian smoothing if necessary.
3. **Contrast Adjustment (−100 to +100)**
   - Linear intensity remapping using `cv.convertScaleAbs`, boosting or reducing global contrast without degrading image alpha channels.
4. **Brightness Correction (−100 to +100)**
   - Pixel-level offset adjustment across all color channels.
5. **Detail Sharpening (0–100)**
   - Unsharp Masking filter using high-frequency subtraction to recover faded textures, textile patterns, and facial contours.
6. **Damage & Scratch Reduction**
   - Grayscale conversion followed by adaptive thresholding to detect high-frequency scratch fragments, morphological closing to bridge gaps, and Telea inpainting (`cv.inpaint`) to reconstruct damaged regions.
7. **Detail Enhancement (CLAHE)**
   - Contrast Limited Adaptive Histogram Equalization applied strictly to the Lightness ($L$) channel of the CIELAB color space to prevent color distortion while revealing shadow details.
8. **Warm Tone Enhancement**
   - For monochrome and grayscale photographs, maps intensity levels to authentic warm photographic tones (shadows $\to$ warm brown, midtones $\to$ warm beige, highlights $\to$ soft cream).
9. **Interactive Before/After Slider**
   - Draggable dual-image comparison slider supporting both touch gestures on mobile devices and mouse drag on desktop screens.
10. **Client-Side History**
    - Stores recent restoration metadata and low-resolution thumbnails locally using browser IndexedDB storage without uploading any data to remote servers.
11. **Direct Download**
    - Exports the full-resolution restored canvas image directly as a standard JPEG (`photorevive-restored.jpg`).

---

## 4. Technologies Used

| Technology | Role / Purpose |
|---|---|
| **React 18** | Component-based reactive user interface |
| **Vite 5** | High-performance modern build tool and dev server |
| **JavaScript (ES6+)** | Core application logic and asynchronous pipelines |
| **OpenCV.js 4.7.0 (WASM)** | Native client-side digital image processing algorithms |
| **HTML5 Canvas** | High-speed pixel manipulation and display buffer |
| **CSS3 (Custom Properties)** | Mobile-first glassmorphic styling, animations, responsive layout |
| **IndexedDB** | Persistent local browser storage for restoration history |
| **Lucide React** | Clean, accessible iconography |

---

## 5. Image Processing Techniques Explained

### A. Bilateral Filtering
Bilateral filtering is an advanced non-linear smoothing filter that smooths textures while preserving sharp boundaries. Unlike a standard Gaussian filter that computes weights based purely on spatial distance:
$$w(i, j, k, l) = \exp\left(-\frac{(i-k)^2 + (j-l)^2}{2\sigma_d^2} - \frac{\|I(i,j) - I(k,l)\|^2}{2\sigma_r^2}\right)$$
It takes into account both the geometric closeness ($\sigma_d$) and the photometric similarity ($\sigma_r$) of neighboring pixels. This ensures flat, noisy regions are smoothed while edges remain crisp.

### B. Contrast Limited Adaptive Histogram Equalization (CLAHE)
Standard Global Histogram Equalization often over-amplifies noise in homogeneous regions. CLAHE overcomes this by:
1. Dividing the image into small contextual tiles (e.g., $8 \times 8$).
2. Computing the histogram for each tile.
3. Clipping histogram bins that exceed a predefined threshold to limit noise amplification.
4. Redistributing clipped pixels uniformly.
5. Combining neighboring tiles using bilinear interpolation to eliminate artificial boundary artifacts.

### C. Unsharp Masking (Sharpening)
Unsharp masking enhances high-frequency edge information by subtracting a smoothed (blurred) version of the image from the original:
$$\text{Details} = \text{Original} - \text{Gaussian}(\text{Original})$$
$$\text{Sharpened} = \text{Original} + \lambda \times \text{Details}$$
Where $\lambda$ controls the boost factor. This accentuates fine lines, fabric weave, and facial features.

### D. Morphological Operations
Morphological processing analyzes shapes within binary masks. The **Closing** operation is defined as a dilation followed by an erosion using a structuring element $B$:
$$A \bullet B = (A \oplus B) \ominus B$$
This connects small breaks in scratches and fills micro-holes caused by film degradation.

### E. Image Inpainting (Telea Algorithm)
Based on the Fast Marching Method (FMM), Alexandru Telea's inpainting algorithm propagates color information from the boundary of known pixels into the identified scratch region along the image gradient normal vectors:
$$I(p) = \frac{\sum_{q \in B_\epsilon(p)} w(p, q) \cdot [I(q) + \nabla I(q)(p - q)]}{\sum_{q \in B_\epsilon(p)} w(p, q)}$$
This synthesizes a visually continuous patch that blends naturally with surrounding pixels.

### F. CIELAB Color Space Separation
The RGB color space couples chromaticity (color) with luminance (brightness). By converting to CIELAB:
- $L^*$: Lightness channel (human perceptual brightness)
- $a^*$: Green–Red color opponent dimension
- $b^*$: Blue–Yellow color opponent dimension
Enhancing contrast exclusively on the $L^*$ channel ensures that colors do not shift, oversaturate, or suffer hue distortion.

---

## 6. System Architecture

PhotoRevive is constructed as a modular Single Page Application (SPA) designed with a clear separation of concerns:

```
+-------------------------------------------------------------------+
|                        PhotoRevive Web UI                         |
|   [Home]   [Restore Photo]   [Compare View]   [History]   [About] |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     React State & Image Context                   |
|   - originalImage (DataURL)      - processedImage (DataURL)       |
|   - imageFile (File)             - processingInfo (Metadata)      |
+-------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  Utils & Storage      |                   | Image Processing Core |
|  - imageUtils.js      |                   | - autoRestore.js      |
|  - validation.js      |                   | - denoise.js          |
|  - storage.js (IDB)   |                   | - contrast.js         |
+-----------------------+                   | - brightness.js       |
                                            | - sharpen.js          |
                                            | - damageRemoval.js    |
                                            | - enhance.js          |
                                            | - warmTone.js         |
                                            +-----------------------+
                                                        |
                                                        v
                                            +-----------------------+
                                            | OpenCV.js 4.7.0 WASM  |
                                            | cv.Mat Operations     |
                                            +-----------------------+
```

### Image Processing Pipeline

```
[Input Image (JPG/PNG/WEBP)]
            ↓
   File Validation (<25MB)
            ↓
   Load into HTMLImageElement
            ↓
  Draw to Canvas & Read cv.Mat
            ↓
   Resize if > 2500px Max Dim
            ↓
  Color Space Conversion (RGBA → RGB → LAB)
            ↓
  CLAHE on L-Channel (Contrast Optimization)
            ↓
  Reconstruct to RGB
            ↓
  Bilateral Filtering (Edge-Preserving Denoising)
            ↓
  Unsharp Masking (Detail & Edge Recovery)
            ↓
  Brightness & Contrast Balancing
            ↓
  Convert to RGBA Display Buffer
            ↓
  Render to Canvas & Export to DataURL / Download
```

---

## 7. Working Principle

1. **Image Ingestion**: The user uploads an image via file picker, drag-and-drop, or mobile camera capture.
2. **Dimension Safeguard**: If either width or height exceeds 2,500 pixels, the image is proportionally downscaled using area interpolation (`cv.INTER_AREA`) to guarantee fluid frame rates on mobile hardware.
3. **Execution**:
   - For **Auto Restore**, the automated multi-stage pipeline executes sequentially.
   - For **Manual Mode**, users adjust sliders and click "Apply Changes" or trigger targeted routines (e.g., "Remove Minor Damage").
4. **Memory Management**: Every intermediate OpenCV `cv.Mat` object allocated in WebAssembly memory is explicitly deallocated using `.delete()` within `finally` blocks to eliminate browser memory leaks.
5. **Result Presentation**: Output is drawn to an offscreen canvas, converted to a high-quality data URL, saved to IndexedDB history, and presented in the viewer and comparison slider.

---

## 8. Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher
- npm (bundled with Node.js) or yarn / pnpm

### Installation Steps

```bash
# 1. Navigate to the project directory
cd "d:\Aayush\MSc-IT\Sem 1\IP\IP Project"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will start locally at:
```
http://localhost:5173
```

---

## 9. How to Run & Build

### Development Mode
```bash
npm run dev
```
Hot Module Replacement (HMR) is enabled. Open your browser and navigate to the printed local address.

### Production Build
```bash
npm run build
```
Generates an optimized, bundled distribution inside the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 10. Project Structure

```
IP Project/
├── index.html                  # HTML entry point + OpenCV.js CDN loader
├── package.json                # Project dependencies and run scripts
├── vite.config.js              # Vite bundler configuration
├── README.md                   # Academic project documentation
│
└── src/
    ├── App.jsx                 # Route manager & top-level layout
    ├── main.jsx                # React DOM entry point
    ├── index.css               # Complete responsive CSS with glassmorphic palette
    │
    ├── components/             # Reusable UI widgets
    │   ├── Header.jsx          # Top navigation bar with back action
    │   ├── BottomNav.jsx       # Mobile bottom navigation bar (5 tabs)
    │   ├── ImageUploader.jsx   # Drag-and-drop / file upload / camera trigger
    │   ├── ImagePreview.jsx    # Card container for original/processed images
    │   ├── BeforeAfterSlider.jsx # Touch-enabled draggable comparison slider
    │   ├── ProcessingControls.jsx # Manual sliders & action triggers
    │   ├── RestorationSummary.jsx # Live performance & operation badges
    │   ├── LoadingOverlay.jsx  # Accessible loading spinner & status
    │   ├── HowItWorks.jsx      # Step-by-step methodology cards
    │   └── HistoryItem.jsx     # Card rendering a past restoration session
    │
    ├── context/
    │   └── ImageContext.jsx    # Shared state for images, metadata, and flags
    │
    ├── imageProcessing/        # OpenCV.js image processing routines
    │   ├── opencvLoader.js     # Asynchronous OpenCV WASM initialization watcher
    │   ├── autoRestore.js      # Full automated multi-stage restoration pipeline
    │   ├── denoise.js          # Bilateral and Gaussian noise reduction
    │   ├── contrast.js         # Linear contrast remapping
    │   ├── brightness.js       # Offset brightness correction
    │   ├── sharpen.js          # Unsharp masking edge enhancement
    │   ├── damageRemoval.js    # Morphological damage detection & inpainting
    │   ├── enhance.js          # CIELAB CLAHE local contrast enhancement
    │   └── warmTone.js         # Authentic sepia/warm photographic mapping
    │
    ├── pages/                  # Top-level view screens
    │   ├── Home.jsx            # Landing page with CTA and feature overview
    │   ├── Restore.jsx         # Primary image restoration workspace
    │   ├── Compare.jsx         # Interactive before/after split viewer
    │   ├── History.jsx         # IndexedDB session browser & clearer
    │   └── About.jsx           # Technical specifications & academic credits
    │
    └── utils/                  # Helper utilities
        ├── imageUtils.js       # Canvas/Mat/DataURL converters & grayscale checker
        ├── validation.js       # File type and size constraints
        └── storage.js          # IndexedDB wrapper for persistent history
```

---

## 11. Screenshots

*(Screenshots can be added here upon presentation)*

| Screen | Description |
|---|---|
| **Landing View** | Mobile-first landing hero with direct actions |
| **Restore Workspace** | Interactive sliders, instant actions, and status badges |
| **Comparison Slider** | Real-time draggable divider comparing original vs. restored |
| **History View** | Locally preserved history with thumbnails and timestamps |

---

## 12. Future Scope

1. **Frequency Domain Filtering**: Adding Fourier Transform ($FFT$) based periodic pattern notch filters to remove halftone screen patterns from newspaper prints.
2. **Deep-Learning Colorization**: Incorporating a client-side ONNX Runtime model for neural semantic colorization of black-and-white portraits.
3. **Automated Scratch Segmentation**: Training a lightweight U-Net model to detect complex tears, folding creases, and fungal decay.
4. **Progressive Web App (PWA)**: Adding Service Worker support and web manifest for offline installation on Android and iOS devices.
5. **WebGL Shader Acceleration**: Offloading 2D convolution kernels to WebGL fragment shaders for 60fps real-time slider updates on 4K images.

---

## 13. Limitations

- **Browser Compute Boundaries**: Processing very high-resolution images (> 15 megapixels) on budget mobile hardware may experience minor latency (~1–2 seconds).
- **Physical Damage Severity**: Deep tears where significant structural information is lost cannot be fully hallucinated without generative neural networks.
- **Initial WASM Download**: OpenCV.js requires an initial download of approximately 8 MB on the first load (subsequently cached by the browser).

---

## 14. Conclusion

PhotoRevive demonstrates the viability and elegance of running classical, deterministic digital image processing algorithms entirely inside modern web browsers. By synthesizing Bilateral Filtering, Adaptive Histogram Equalization (CLAHE), Unsharp Masking, and Morphological Inpainting into a unified mobile-first interface, it provides effective restoration capabilities while serving as a clear, demonstrable academic project for the study of Image Processing.

---

**Academic Mini-Project – Image Processing**  
*Department of Information Technology*
