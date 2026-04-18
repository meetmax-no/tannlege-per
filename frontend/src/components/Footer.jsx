import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { clinicInfo } from '../data/mockData';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-amber-900 to-amber-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">{clinicInfo.name}</h3>
            <p className="text-amber-100 leading-relaxed">
              Sentralt beliggende allmennpraksis med fokus på hyggelig og trygg atmosfære.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hurtiglenker</h4>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection('tjenester')}
                className="block text-amber-100 hover:text-white transition-colors"
              >
                Tjenester
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="block text-amber-100 hover:text-white transition-colors"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('priser')}
                className="block text-amber-100 hover:text-white transition-colors"
              >
                Priser
              </button>
              <button
                onClick={() => scrollToSection('apningstider')}
                className="block text-amber-100 hover:text-white transition-colors"
              >
                Åpningstider
              </button>
              <button
                onClick={() => scrollToSection('kontakt')}
                className="block text-amber-100 hover:text-white transition-colors"
              >
                Kontakt
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-amber-300 flex-shrink-0" />
                <a
                  href={`tel:${clinicInfo.phone.replace(/\s/g, '')}`}
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  {clinicInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-amber-300 flex-shrink-0" />
                <a
                  href={`mailto:${clinicInfo.email}`}
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  {clinicInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-300 flex-shrink-0 mt-1" />
                <span className="text-amber-100">{clinicInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-12 pt-8 text-center">
          <p className="text-amber-200 text-sm">
            © {currentYear} {clinicInfo.name}. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
};
