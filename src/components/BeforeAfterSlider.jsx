import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

/**
 * Interactive before/after image comparison slider.
 */
const BeforeAfterSlider = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, [isDragging]);

  const onPointerMove = useCallback((e) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', stopDragging);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, onPointerMove, onTouchMove, stopDragging]);

  return (
    <div 
      className="before-after" 
      ref={containerRef}
      style={{ touchAction: 'none' }}
    >
      <img src={after} alt="Restored" className="before-after__img" />
      
      <div 
        className="before-after__overlay" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt="Original" 
          className="before-after__img"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
        />
        <div className="before-after__label-left">ORIGINAL</div>
      </div>
      
      <div className="before-after__label-right">RESTORED</div>

      <div 
        className="before-after__divider" 
        style={{ left: `${sliderPosition}%` }}
      >
        <div 
          className="before-after__handle"
          onPointerDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          role="slider"
          aria-valuenow={sliderPosition}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <ArrowLeftRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
