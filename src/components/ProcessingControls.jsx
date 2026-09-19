import React, { useState } from 'react';
import { Sparkles, Eraser, ZoomIn, Sun, RotateCcw } from 'lucide-react';

/**
 * Controls for manually and automatically adjusting restoration parameters.
 */
const ProcessingControls = ({ 
  onAutoRestore, 
  onApply, 
  onDamageRemoval, 
  onEnhance, 
  onWarmTone, 
  onReset, 
  showWarmTone, 
  isProcessing 
}) => {
  const defaultState = { denoise: 0, brightness: 0, contrast: 0, sharpness: 0 };
  const [controls, setControls] = useState(defaultState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setControls(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleApply = () => {
    onApply(controls);
  };

  const handleReset = () => {
    setControls(defaultState);
    onReset();
  };

  return (
    <div className="controls-section">
      <button 
        className="btn-auto-restore" 
        onClick={onAutoRestore} 
        disabled={isProcessing}
      >
        <Sparkles size={18} /> ✨ Auto Restore
      </button>

      <h3 className="section-title">Manual Adjustments</h3>

      <div className="control-group">
        <div className="control-label">
          <span>Noise Reduction</span>
          <span className="control-value">{controls.denoise}</span>
        </div>
        <input 
          type="range" 
          name="denoise" 
          min="0" max="100" 
          value={controls.denoise} 
          onChange={handleChange} 
          disabled={isProcessing} 
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Brightness</span>
          <span className="control-value">{controls.brightness}</span>
        </div>
        <input 
          type="range" 
          name="brightness" 
          min="-100" max="100" 
          value={controls.brightness} 
          onChange={handleChange} 
          disabled={isProcessing} 
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Contrast</span>
          <span className="control-value">{controls.contrast}</span>
        </div>
        <input 
          type="range" 
          name="contrast" 
          min="-100" max="100" 
          value={controls.contrast} 
          onChange={handleChange} 
          disabled={isProcessing} 
        />
      </div>

      <div className="control-group">
        <div className="control-label">
          <span>Sharpness</span>
          <span className="control-value">{controls.sharpness}</span>
        </div>
        <input 
          type="range" 
          name="sharpness" 
          min="0" max="100" 
          value={controls.sharpness} 
          onChange={handleChange} 
          disabled={isProcessing} 
        />
      </div>

      <div className="controls-actions">
        <button className="btn-action" onClick={onDamageRemoval} disabled={isProcessing}>
          <Eraser size={18} /> Remove Minor Damage
        </button>
        <button className="btn-action" onClick={onEnhance} disabled={isProcessing}>
          <ZoomIn size={18} /> Enhance Details
        </button>
        {showWarmTone && (
          <button className="btn-action" onClick={onWarmTone} disabled={isProcessing}>
            <Sun size={18} /> Warm Tone Enhancement
          </button>
        )}
      </div>

      <div className="btn-group">
        <button className="btn-reset" onClick={handleReset} disabled={isProcessing}>
          <RotateCcw size={18} /> Reset
        </button>
        <button className="btn-primary" onClick={handleApply} disabled={isProcessing}>
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default ProcessingControls;
