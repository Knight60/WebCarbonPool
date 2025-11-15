import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const baseStyle = "px-3 py-2 rounded-md text-sm font-medium th-font transition-colors w-full md:w-auto text-left md:text-center";
    if (isActive) {
      return `${baseStyle} text-slate-900 bg-white font-bold`;
    }
    return `${baseStyle} text-white hover:bg-emerald-600`;
  };

  return (
    <header className="bg-emerald-700 shadow-md sticky top-0 z-30">
      <nav className="max-w-full mx-auto p-4 px-8 flex flex-wrap items-center justify-between">
        {/* Logo Section */}
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <Logo />
        </NavLink>

        {/* Mobile menu button (hidden on md screens and up) */}
        <div className="block md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white rounded-md p-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="md:flex md:space-x-2 md:mt-0 mt-4 space-y-2 md:space-y-0">
            <NavLink to="/" className={getNavLinkClass} end onClick={() => setIsOpen(false)}>
              หน้าหลัก
            </NavLink>
            <NavLink to="/plots" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              แปลงสำรวจ
            </NavLink>
            <NavLink to="/species" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              ชนิดพันธุ์
            </NavLink>
            <NavLink to="/spatial" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              AI Spatial
            </NavLink>
            <NavLink to="/taxonomy" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              AI Taxonomy
            </NavLink>
            <NavLink to="/data" className={getNavLinkClass} onClick={() => setIsOpen(false)}>
              Open Data
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;