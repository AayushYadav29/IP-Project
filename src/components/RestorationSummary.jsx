import React from 'react';
import { CheckCircle, Clock, Monitor } from 'lucide-react';

/**
 * Summary component to display applied restoration operations and metadata.
 */
const RestorationSummary = ({ 
  operations = [], 
  processingTime = 0, 
  resolution = { width: 0, height: 0 } 
}) => {
  return (
    <div className="restoration-summary">
      <h3>Restoration Summary</h3>
      {operations && operations.length > 0 ? (
        operations.map((op, i) => (
          <div key={i} className="summary-item">
            <CheckCircle size={16} className="summary-check" />
            <span>{op}</span>
          </div>
        ))
      ) : (
        <div className="summary-item">
          <CheckCircle size={16} className="summary-check" />
          <span>Image restored</span>
        </div>
      )}
      <div className="summary-meta">
        <span><Clock size={14} /> {(processingTime || 0).toFixed(0)} ms</span>
        <span><Monitor size={14} /> {resolution?.width || 0} × {resolution?.height || 0}</span>
      </div>
    </div>
  );
};

export default RestorationSummary;
