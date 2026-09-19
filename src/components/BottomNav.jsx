import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Sparkles, ArrowLeftRight, Clock, Info } from 'lucide-react';

/**
 * Bottom navigation bar with 5 main tabs.
 */
const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/restore', label: 'Restore', icon: Sparkles },
    { path: '/compare', label: 'Compare', icon: ArrowLeftRight },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
          >
            <Icon className="bottom-nav__icon" size={22} />
            <span className="bottom-nav__label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
