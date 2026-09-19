import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import ProcessingControls from '../components/ProcessingControls';
import RestorationSummary from '../components/RestorationSummary';
import LoadingOverlay from '../components/LoadingOverlay';
import { useImage } from '../context/ImageContext';
import { waitForOpenCV } from '../imageProcessing/opencvLoader';
import { denoise } from '../imageProcessing/denoise';
import { adjustContrast } from '../imageProcessing/contrast';
import { adjustBrightness } from '../imageProcessing/brightness';
import { sharpen } from '../imageProcessing/sharpen';
import { removeDamage } from '../imageProcessing/damageRemoval';
import { enhanceDetails } from '../imageProcessing/enhance';
import { applyWarmTone } from '../imageProcessing/warmTone';
import { autoRestore } from '../imageProcessing/autoRestore';
import { fileToImageElement, imageToMat, matToDataURL, resizeIfNeeded, isGrayscaleImage } from '../utils/imageUtils';
import { saveToHistory } from '../utils/storage';

const Restore = () => {
  const navigate = useNavigate();
  const {
    originalImage, setOriginalImage,
    processedImage, setProcessedImage,
    imageFile, setImageFile,
    processingInfo, setProcessingInfo,
    isProcessing, setIsProcessing,
    isGrayscaleImg, setIsGrayscaleImg,
    resetAll
  } = useImage();

  const [step, setStep] = useState('upload');
  const [viewMode, setViewMode] = useState('original');
  const [cvReady, setCvReady] = useState(false);
  const [cvError, setCvError] = useState(null);

  useEffect(() => {
    waitForOpenCV()
      .then(() => setCvReady(true))
      .catch(err => setCvError(err.message || 'Failed to load OpenCV'));
  }, []);

  useEffect(() => {
    if (originalImage && step === 'upload') {
      setStep('processing');
    }
  }, [originalImage, step]);

  const handleImageSelect = async (file, dataURL) => {
    setImageFile(file);
    setOriginalImage(dataURL);
    setProcessedImage(null);
    setProcessingInfo({ operations: [], processingTime: 0, resolution: { width: 0, height: 0 } });
    setViewMode('original');
    
    // detect grayscale
    try {
      const img = await fileToImageElement(file);
      const isGray = isGrayscaleImage(img);
      setIsGrayscaleImg(isGray);
    } catch (e) {
      console.error("Error detecting grayscale:", e);
    }

    setStep('processing');
  };

  const handleBack = () => {
    resetAll();
    setStep('upload');
  };

  const saveThumbnail = (dataURL, resolution) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 100;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        saveToHistory({
          name: imageFile?.name || 'Restored Image',
          thumbnail,
          date: new Date().toISOString(),
          resolution,
          status: 'Restored'
        });
      };
      img.src = dataURL;
    } catch (e) {
      console.error("Error saving thumbnail:", e);
    }
  };

  const handleAutoRestore = async () => {
    if (!cvReady || !originalImage) return;
    setIsProcessing(true);
    try {
      const img = await fileToImageElement(imageFile);
      let src = imageToMat(img);
      src = resizeIfNeeded(src, 2500);
      const { result, operations, processingTime } = autoRestore(src);
      const dataURL = matToDataURL(result);
      setProcessedImage(dataURL);
      const resolution = { width: result.cols, height: result.rows };
      setProcessingInfo({ operations, processingTime, resolution });
      result.delete();
      src.delete();
      setViewMode('restored');
      saveThumbnail(dataURL, resolution);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = async ({ denoise: dVal, brightness: bVal, contrast: cVal, sharpness: sVal }) => {
    if (!cvReady || !originalImage) return;
    setIsProcessing(true);
    try {
      const startTime = performance.now();
      const img = new Image();
      img.src = originalImage;
      await new Promise(resolve => img.onload = resolve);
      let mat = imageToMat(img);
      mat = resizeIfNeeded(mat, 2500);
      
      const ops = [];
      if (dVal > 0) { let tmp = denoise(mat, dVal); mat.delete(); mat = tmp; ops.push('Noise reduced'); }
      if (cVal !== 0) { let tmp = adjustContrast(mat, cVal); mat.delete(); mat = tmp; ops.push('Contrast adjusted'); }
      if (bVal !== 0) { let tmp = adjustBrightness(mat, bVal); mat.delete(); mat = tmp; ops.push('Brightness adjusted'); }
      if (sVal > 0) { let tmp = sharpen(mat, sVal); mat.delete(); mat = tmp; ops.push('Details sharpened'); }
      
      const processingTime = performance.now() - startTime;
      const dataURL = matToDataURL(mat);
      setProcessedImage(dataURL);
      const resolution = { width: mat.cols, height: mat.rows };
      setProcessingInfo({ operations: ops, processingTime, resolution });
      mat.delete();
      setViewMode('restored');
      saveThumbnail(dataURL, resolution);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDamageRemoval = async () => {
    if (!cvReady || !originalImage) return;
    setIsProcessing(true);
    try {
      const startTime = performance.now();
      const img = new Image();
      img.src = originalImage;
      await new Promise(resolve => img.onload = resolve);
      let mat = imageToMat(img);
      mat = resizeIfNeeded(mat, 2500);
      
      const result = removeDamage(mat);
      mat.delete();
      
      const processingTime = performance.now() - startTime;
      const dataURL = matToDataURL(result);
      setProcessedImage(dataURL);
      const resolution = { width: result.cols, height: result.rows };
      setProcessingInfo({ 
        operations: ['Damage repaired'], 
        processingTime, 
        resolution 
      });
      result.delete();
      setViewMode('restored');
      saveThumbnail(dataURL, resolution);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = async () => {
    if (!cvReady || !originalImage) return;
    setIsProcessing(true);
    try {
      const startTime = performance.now();
      const img = new Image();
      img.src = originalImage;
      await new Promise(resolve => img.onload = resolve);
      let mat = imageToMat(img);
      mat = resizeIfNeeded(mat, 2500);
      
      const result = enhanceDetails(mat);
      mat.delete();
      
      const processingTime = performance.now() - startTime;
      const dataURL = matToDataURL(result);
      setProcessedImage(dataURL);
      const resolution = { width: result.cols, height: result.rows };
      setProcessingInfo({ 
        operations: ['Details enhanced'], 
        processingTime, 
        resolution 
      });
      result.delete();
      setViewMode('restored');
      saveThumbnail(dataURL, resolution);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWarmTone = async () => {
    if (!cvReady || !originalImage) return;
    setIsProcessing(true);
    try {
      const startTime = performance.now();
      const img = new Image();
      img.src = originalImage;
      await new Promise(resolve => img.onload = resolve);
      let mat = imageToMat(img);
      mat = resizeIfNeeded(mat, 2500);
      
      const result = applyWarmTone(mat);
      mat.delete();
      
      const processingTime = performance.now() - startTime;
      const dataURL = matToDataURL(result);
      setProcessedImage(dataURL);
      const resolution = { width: result.cols, height: result.rows };
      setProcessingInfo({ 
        operations: ['Warm tone applied'], 
        processingTime, 
        resolution 
      });
      result.delete();
      setViewMode('restored');
      saveThumbnail(dataURL, resolution);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessedImage(null);
    setProcessingInfo({ operations: [], processingTime: 0, resolution: { width: 0, height: 0 } });
    setViewMode('original');
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'photorevive-restored.jpg';
    a.click();
  };

  if (cvError) {
    return (
      <div className="restore-page">
        <Header title="Restore Photo" />
        <div className="error-message">{cvError}</div>
      </div>
    );
  }

  if (step === 'upload') {
    return (
      <div className="restore-page">
        <Header title="Restore Photo" />
        <div className="restore-section">
          <ImageUploader onImageSelect={handleImageSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="restore-page">
      <Header title="Restore Photo" showBack={true} onBack={handleBack} />
      
      <div className="restore-section">
        <div className="image-toggle">
          <button 
            className={viewMode === 'original' ? 'active' : ''}
            onClick={() => setViewMode('original')}
          >
            Original
          </button>
          <button 
            className={viewMode === 'restored' ? 'active' : ''}
            onClick={() => setViewMode('restored')}
            disabled={!processedImage}
          >
            Restored
          </button>
        </div>

        <ImagePreview 
          src={viewMode === 'original' ? originalImage : (processedImage || originalImage)} 
          label={viewMode === 'original' ? 'Original Photo' : 'Restored Photo'} 
        />
        
        <ProcessingControls 
          onAutoRestore={handleAutoRestore}
          onApply={handleApply}
          onDamageRemoval={handleDamageRemoval}
          onEnhance={handleEnhance}
          onWarmTone={handleWarmTone}
          onReset={handleReset}
          showWarmTone={isGrayscaleImg}
          isProcessing={isProcessing || !cvReady}
        />

        {processedImage && (
          <>
            <div style={{ marginTop: '1.25rem' }}>
              <RestorationSummary 
                operations={processingInfo.operations} 
                processingTime={processingInfo.processingTime} 
                resolution={processingInfo.resolution} 
              />
            </div>
            <button className="btn-download" onClick={handleDownload} style={{ marginTop: '1rem' }}>
              ⬇ Download Restored Photo
            </button>
          </>
        )}
      </div>

      <LoadingOverlay visible={isProcessing} message="Processing image..." />
    </div>
  );
};

export default Restore;
