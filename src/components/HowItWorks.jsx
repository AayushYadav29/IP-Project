import React from 'react';
import { Upload, Search, Eraser, SunMedium, Maximize, Download } from 'lucide-react';

/**
 * Static component explaining the restoration process steps.
 */
const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Select an old or damaged photograph from your device',
    },
    {
      icon: Search,
      title: 'Analyze Image',
      description: 'The system examines image quality and detects issues',
    },
    {
      icon: Eraser,
      title: 'Remove Noise',
      description: 'Bilateral filtering reduces noise while preserving edges',
    },
    {
      icon: SunMedium,
      title: 'Enhance Contrast',
      description: 'CLAHE and histogram techniques improve tonal range',
    },
    {
      icon: Maximize,
      title: 'Sharpen Details',
      description: 'Unsharp masking recovers fine details and textures',
    },
    {
      icon: Download,
      title: 'Generate Result',
      description: 'Download your enhanced, restored photograph',
    }
  ];

  return (
    <div className="how-it-works">
      <h2>How It Works</h2>
      <div className="how-it-works__steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="how-step">
              <div className="how-step__number">
                <Icon size={24} />
              </div>
              <div className="how-step__content">
                <h4 className="how-step__title">{step.title}</h4>
                <p className="how-step__description">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
