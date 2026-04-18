import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X } from 'lucide-react';
import { clinicInfo } from '../data/mockData';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1
              className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-amber-900' : 'text-white'
              }`}
            >
              Tannlegene Måreid
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Hjem
            </button>
            <button
              onClick={() => scrollToSection('tjenester')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Tjenester
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('priser')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Priser
            </button>
            <button
              onClick={() => scrollToSection('apningstider')}
              className={`font-medium transition-colors hover:text-amber-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Åpningstider
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-700 transition-all hover:scale-105"
            >
              Kontakt oss
            </button>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Hjem
            </button>
            <button
              onClick={() => scrollToSection('tjenester')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Tjenester
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection('priser')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Priser
            </button>
            <button
              onClick={() => scrollToSection('apningstider')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Åpningstider
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="block w-full text-left px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors"
            >
              Kontakt oss
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
