import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Header component for screens, optionally showing a back button.
 */
const Header = ({ title, showBack = false, onBack }) => {
  return (
    <header className="header">
      {showBack && (
        <button className="header__back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 className="header__title">{title}</h1>
    </header>
  );
};

export default Header;
