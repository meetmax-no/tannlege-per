import React from 'react';
import { Stethoscope, Smile, HeartPulse, Sparkles, AlertCircle, GraduationCap } from 'lucide-react';
import { services } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const iconMap = {
  Stethoscope,
  Smile,
  HeartPulse,
  Sparkles,
  AlertCircle,
  GraduationCap
};

export const Services = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-amber-50/30"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className="text-amber-700" size={28} />
                  </div>
                  <CardTitle className="text-xl text-amber-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
