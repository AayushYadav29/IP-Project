import React from 'react';
import { GraduationCap, Code, Terminal, Eye, Layout, Palette, Zap } from 'lucide-react';
import Header from '../components/Header';
import HowItWorks from '../components/HowItWorks';

const About = () => {
  return (
    <div className="about-page">
      <Header title="About" />
      
      <div className="about-content">
        <section className="about-hero">
          <div className="about-badge">
            <GraduationCap size={16} />
            <span>Academic Mini Project</span>
          </div>
          <h1 className="about-title">About PhotoRevive</h1>
          <p className="about-description">
            PhotoRevive is an image processing application designed to restore and enhance old, damaged, or faded photographs directly in your browser.
          </p>
        </section>

        <section className="about-section">
          <h2>Technologies Used</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <Code className="tech-card-icon" />
              <span>React</span>
            </div>
            <div className="tech-card">
              <Terminal className="tech-card-icon" />
              <span>JavaScript</span>
            </div>
            <div className="tech-card">
              <Eye className="tech-card-icon" />
              <span>OpenCV.js</span>
            </div>
            <div className="tech-card">
              <Layout className="tech-card-icon" />
              <span>HTML5 Canvas</span>
            </div>
            <div className="tech-card">
              <Palette className="tech-card-icon" />
              <span>CSS3</span>
            </div>
            <div className="tech-card">
              <Zap className="tech-card-icon" />
              <span>Vite</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Image Processing Techniques</h2>
          <ul className="technique-list">
            <li className="technique-item"><span className="technique-dot"></span> Grayscale Conversion</li>
            <li className="technique-item"><span className="technique-dot"></span> Noise Reduction (Bilateral Filtering)</li>
            <li className="technique-item"><span className="technique-dot"></span> Contrast Enhancement (CLAHE)</li>
            <li className="technique-item"><span className="technique-dot"></span> Unsharp Masking</li>
            <li className="technique-item"><span className="technique-dot"></span> Morphological Operations</li>
            <li className="technique-item"><span className="technique-dot"></span> Image Inpainting</li>
            <li className="technique-item"><span className="technique-dot"></span> Brightness Adjustment</li>
            <li className="technique-item"><span className="technique-dot"></span> Histogram Equalization</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <HowItWorks />
        </section>
      </div>

      <footer className="about-footer" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666' }}>
        <p>Academic Mini Project – Image Processing</p>
        <p>Built with React, JavaScript & OpenCV.js</p>
      </footer>
    </div>
  );
};

export default About;
