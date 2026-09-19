import React from 'react';

/**
 * Component to display a simple image preview.
 */
const ImagePreview = ({ src, label }) => {
  return (
    <div className="image-preview">
      <img className="image-preview__img" src={src} alt={label || 'Image preview'} />
      {label && <div className="image-preview__label">{label}</div>}
    </div>
  );
};

export default ImagePreview;
