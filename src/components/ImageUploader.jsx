import React, { useState, useRef } from 'react';
import { ImagePlus, Camera } from 'lucide-react';
import { validateImageFile } from '../utils/validation';

/**
 * ImageUploader component for drag & drop or file selection.
 */
const ImageUploader = ({ onImageSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = (file) => {
    setError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target.result);
    };
    reader.onerror = () => {
      setError('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`upload-area ${isDragOver ? 'upload-area--dragover' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <ImagePlus className="upload-icon" size={48} />
      <h3 className="upload-title">Drag & Drop Image Here</h3>
      <p className="upload-formats">Supported formats: JPEG, PNG, WEBP</p>
      
      <button 
        className="upload-btn" 
        onClick={() => fileInputRef.current?.click()}
        aria-label="Select an image file"
      >
        Select File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
      />

      <div className="upload-or">OR</div>

      <button 
        className="upload-camera-btn" 
        onClick={() => cameraInputRef.current?.click()}
        aria-label="Take a photo with camera"
      >
        <Camera size={20} /> Take Photo
      </button>
      <input
        type="file"
        ref={cameraInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={onFileChange}
      />

      {error && <div className="upload-error" role="alert">{error}</div>}
    </div>
  );
};

export default ImageUploader;
