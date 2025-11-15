import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo: React.FC = () => (
  <div className="flex items-center space-x-3">
    <img 
      className="h-12 w-12" 
      src={`${import.meta.env.BASE_URL}images/logo-dcce.png`} 
      alt="Carbon Pool Project Logo" 
    />
    <div>
      <h1 className="text-lg font-bold text-white">Carbon Pool Project</h1>
      <p className="text-xs text-emerald-100">โครงการประเมินการสะสมคาร์บอนในพื้นที่สีเขียว</p>
    </div>
  </div>
);

const Header: React.FC = () => {

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const baseStyle = "px-3 py-2 rounded-md text-sm font-medium th-font transition-colors";
    if (isActive) {
      return `${baseStyle} text-slate-900 bg-white font-bold`; 
    }
    return `${baseStyle} text-white hover:bg-emerald-600`; 
  };

  return (
    <header className="bg-emerald-700 shadow-md sticky top-0 z-30">
      <nav className="max-w-full mx-auto flex items-center justify-between p-4 px-8">
        
        <NavLink to="/">
          <Logo />
        </NavLink>

        <div className="flex space-x-2">
          
          <NavLink to="/" className={getNavLinkClass} end>
            หน้าหลัก
          </NavLink>
          <NavLink to="/plots" className={getNavLinkClass}>
            แปลงสำรวจ
          </NavLink>
          <NavLink to="/species" className={getNavLinkClass}>
            ชนิดพันธุ์
          </NavLink>
          <NavLink to="/spatial" className={getNavLinkClass}>
            AI Spatial
          </NavLink>
          <NavLink to="/taxonomy" className={getNavLinkClass}>
            AI Taxonomy
          </NavLink>
          <NavLink to="/data" className={getNavLinkClass}>
            Open Data
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;