import React, { useState, useEffect } from 'react';
import { Stethoscope, Smile, HeartPulse, Sparkles, AlertCircle, GraduationCap, Activity, ArrowRightLeft, Baby, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

const iconMap = {
  Stethoscope,
  Smile,
  HeartPulse,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Activity,
  ArrowRightLeft,
  Baby
};

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch('/data/tjenester.json')
      .then(response => response.json())
      .then(data => {
        // Sorter tjenester alfabetisk etter tittel
        const sortedServices = data.tjenester.sort((a, b) => 
          a.tittel.localeCompare(b.tittel, 'nb-NO')
        );
        setServices(sortedServices);
        setLoading(false);
      })
      .catch(error => {
        console.error('Feil ved lasting av tjenester:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="tjenester" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Laster tjenester...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tjenester" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Våre tjenester
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vi tilbyr et bredt spekter av tannhelsetjenester for hele familien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.ikon];
            return (
              <Card
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-amber-50/30 cursor-pointer"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="text-amber-700" size={28} />
                  </div>
                  <CardTitle className="text-xl text-amber-900">
                    {service.tittel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {service.kort_beskrivelse}
                  </CardDescription>
                  <p className="text-amber-700 font-semibold mt-4 text-sm">
                    Klikk for mer info →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Detail Modal */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedService && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {React.createElement(iconMap[selectedService.ikon], {
                        className: "text-amber-700",
                        size: 32
                      })}
                    </div>
                    <DialogTitle className="text-3xl text-amber-900">
                      {selectedService.tittel}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-base text-gray-700 leading-relaxed">
                    {selectedService.detaljert_beskrivelse}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-amber-900 mb-4">
                    Behandlingen inkluderer:
                  </h4>
                  <ul className="space-y-2">
                    {selectedService.inkluderer.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-amber-100">
                  <Button
                    onClick={() => {
                      setSelectedService(null);
                      document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Bestill time for denne behandlingen
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartPulse className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-amber-900 mb-2">
                Helfo-refusjoner
              </h3>
              <p className="text-gray-700 mb-4">
                Mange tilstander gir krav på refusjon fra Helfo, for eksempel tannkjøttsykdom. 
                Vi hjelper deg med å få den støtten du har krav på.
              </p>
              <a
                href="https://www.helsedirektoratet.no/rundskriv/kapittel-5-stonad-ved-helsetjenester/takster-for-tannbehandling-"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 font-semibold hover:text-amber-800 transition-colors underline"
              >
                Les mer om Helfo-refusjoner →
              </a>
            </div>
          </div>
        </div>

        {/* Student Offer */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-300 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                Studenttilbud 🎓
              </h3>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-blue-800">•</span>
                  <p className="text-gray-700 font-medium">
                    <strong>Undersøkelse/rtg og puss/rens:</strong> kun 950,-
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-blue-800">•</span>
                  <p className="text-gray-700 font-medium">
                    <strong>15% rabatt</strong> på øvrig behandling
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">
                Gyldig studentbevis må fremvises ved timebestilling
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
