import { createContext, useContext, useState, useCallback } from 'react'

const ImageContext = createContext(null)

/**
 * Global image state provider.
 * Stores original/processed images as data URLs,
 * processing metadata, and grayscale detection flag.
 */
export function ImageProvider({ children }) {
  const [originalImage, setOriginalImage] = useState(null)      // data URL string
  const [processedImage, setProcessedImage] = useState(null)    // data URL string
  const [imageFile, setImageFile] = useState(null)              // File object
  const [processingInfo, setProcessingInfo] = useState({
    operations: [],
    processingTime: 0,
    resolution: { width: 0, height: 0 }
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGrayscaleImg, setIsGrayscaleImg] = useState(false)

  const resetAll = useCallback(() => {
    setOriginalImage(null)
    setProcessedImage(null)
    setImageFile(null)
    setProcessingInfo({ operations: [], processingTime: 0, resolution: { width: 0, height: 0 } })
    setIsProcessing(false)
    setIsGrayscaleImg(false)
  }, [])

  const value = {
    originalImage, setOriginalImage,
    processedImage, setProcessedImage,
    imageFile, setImageFile,
    processingInfo, setProcessingInfo,
    isProcessing, setIsProcessing,
    isGrayscaleImg, setIsGrayscaleImg,
    resetAll
  }

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  )
}

export function useImage() {
  const context = useContext(ImageContext)
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider')
  }
  return context
}
