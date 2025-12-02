import React, { useState, useRef, useEffect } from 'react';
import { Home, Info, Sparkles, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ Import the logo (Adjust path if needed)
import logo from '../../assets/logo.png'; 

/**
 * MagneticNavItem Component
 */
const MagneticNavItem = ({ children, active, onClick }) => {
  const itemRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // "Pull" factor - higher number = stronger pull
    const distanceX = (clientX - centerX);
    const distanceY = (clientY - centerY);

    setPosition({ x: distanceX * 0.2, y: distanceY * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={itemRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className={`
        relative px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ease-out
        ${active 
          ? 'text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {children}
    </button>
  );
};

/**
 * GlassNavbar Component
 */
const GlassNavbar = () => {
  const navRef = useRef(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  // Update active tab based on current URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/login') setActiveTab('Login');
    else if (path === '/about') setActiveTab('About');
    else if (path === '/') setActiveTab('Home');
    else setActiveTab('');
  }, [location.pathname]);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    
    const rect = navRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setSpotlightPos(prev => ({ ...prev, opacity: 0 }));
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'About', icon: Info, path: '/about' },
    { name: 'Features', icon: Sparkles, path: '/#features' },
    { name: 'Login', icon: LogIn, path: '/login' },
  ];

  // ✅ IMPROVED: Logo Click Handler
  const handleLogoClick = () => {
    setActiveTab('Home'); // Visually set Home as active
    
    if (location.pathname === '/') {
        // If already on home, just scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // If elsewhere, navigate home and reset scroll
        navigate('/');
        window.scrollTo(0, 0);
    }
  };

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    
    if (item.path.startsWith('/#')) {
        const targetId = item.path.replace('/#', '');
        
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        navigate(item.path);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          relative flex items-center gap-1 p-1.5 rounded-full
          bg-white/[0.03] border border-white/[0.08]
          backdrop-blur-md saturate-150
          shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]
          transition-transform duration-300 hover:scale-[1.02]
        "
      >
        {/* Spotlight Effect Layer */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(600px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.06), transparent 40%)`
          }}
        />

        {/* Logo Section */}
        <div className="flex items-center pl-2 pr-1">
            <button 
                onClick={handleLogoClick} // ✅ Uses the improved handler
                className="hover:scale-110 transition-transform duration-200"
            >
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-10 h-10 object-contain" 
                />
            </button>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-white/10 mx-1 rounded-full" />

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <MagneticNavItem
              key={item.name}
              active={activeTab === item.name}
              onClick={() => handleNavigation(item)}
            >
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10">{item.name}</span>
            </MagneticNavItem>
          );
        })}
      </nav>
    </div>
  );
};

export default GlassNavbar;