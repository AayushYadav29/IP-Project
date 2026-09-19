import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, Sun, Focus, Shield, ArrowRight } from 'lucide-react';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  const navigate = useNavigate();

  const handleScrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">
          <Camera className="hero-badge-icon" size={16} />
          <span>Image Processing Project</span>
        </div>
        <h1 className="hero-title">Photo<span className="text-primary">Revive</span></h1>
        <p className="hero-subtitle">
          Bring old memories back to life. Enhance faded, noisy and damaged photographs using image processing.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/restore')}>
            Start Restoring
          </button>
          <button className="btn btn-secondary" onClick={handleScrollToHowItWorks}>
            Learn How It Works
          </button>
        </div>

        <div className="hero-visual-card">
          <div className="hero-visual-label">Old, Faded Photo</div>
          <ArrowRight className="hero-arrow" size={24} />
          <div className="hero-visual-label">Restored Photo</div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Zap className="feature-icon" />
            <h3>Noise Reduction</h3>
            <p>Advanced bilateral filtering removes grain while preserving details</p>
          </div>
          <div className="feature-card">
            <Sun className="feature-icon" />
            <h3>Contrast Enhancement</h3>
            <p>CLAHE and histogram equalization restore tonal range</p>
          </div>
          <div className="feature-card">
            <Focus className="feature-icon" />
            <h3>Detail Sharpening</h3>
            <p>Unsharp masking recovers fine textures and edges</p>
          </div>
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3>Damage Repair</h3>
            <p>Morphological operations and inpainting fix minor scratches</p>
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <HowItWorks />
      </div>
    </div>
  );
};

export default Home;
