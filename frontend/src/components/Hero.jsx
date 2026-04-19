import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { clinicInfo } from '../data/mockData';

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('kontakt');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
          alt="Modern dental clinic"
          className="w-full h-full object-cover object-center md:object-left"
        />
        {/* Mobile gradient - lighter and from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/85 via-amber-800/60 to-amber-900/40 md:hidden"></div>
        {/* Desktop gradient - original */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-transparent hidden md:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {clinicInfo.tagline}
          </h1>
          <p className="text-xl md:text-2xl text-amber-50 mb-8 leading-relaxed">
            {clinicInfo.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={scrollToContact}
              className="bg-white text-amber-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-50 transition-all hover:scale-105 shadow-xl"
            >
              Bestill time
            </button>
            <a
              href={`tel:${clinicInfo.phone.replace(/\s/g, '')}`}
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-700 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Ring oss
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-white">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-amber-300" />
              <span className="font-medium">{clinicInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-amber-300" />
              <span className="font-medium">{clinicInfo.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50 to-transparent z-10"></div>
    </section>
  );
};
