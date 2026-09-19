import React from 'react';
import { Link } from 'react-router-dom';
import { SplitSquareHorizontal } from 'lucide-react';
import Header from '../components/Header';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import RestorationSummary from '../components/RestorationSummary';
import { useImage } from '../context/ImageContext';

const Compare = () => {
  const { originalImage, processedImage, processingInfo } = useImage();

  return (
    <div className="compare-page">
      <Header title="Compare" />
      
      <div className="compare-content">
        {originalImage && processedImage ? (
          <>
            <BeforeAfterSlider before={originalImage} after={processedImage} />
            <RestorationSummary 
              operations={processingInfo.operations} 
              processingTime={processingInfo.processingTime} 
              resolution={processingInfo.resolution} 
            />
          </>
        ) : (
          <div className="compare-empty">
            <SplitSquareHorizontal className="compare-empty-icon" size={48} />
            <h2>No comparison available</h2>
            <p>Restore a photo first to compare results.</p>
            <Link to="/restore" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Go to Restore
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
