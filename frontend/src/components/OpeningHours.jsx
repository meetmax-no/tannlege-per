import React from 'react';
import { Clock } from 'lucide-react';
import { openingHours } from '../data/mockData';
import { Card, CardContent } from './ui/card';

export const OpeningHours = () => {
  return (
    <section id="apningstider" className="py-24 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Clock className="text-amber-700" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Åpningstider
          </h2>
          <p className="text-xl text-gray-600">
            Vi er her for deg når du trenger oss
          </p>
        </div>

        <Card className="border-2 border-amber-100 shadow-xl bg-white">
          <CardContent className="p-8">
            <div className="space-y-4">
              {openingHours.map((day, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-4 border-b border-amber-50 last:border-0 ${
                    day.hours === 'Stengt' ? 'opacity-60' : ''
                  }`}
                >
                  <span className="text-lg font-semibold text-amber-900">
                    {day.day}
                  </span>
                  <span
                    className={`text-lg font-medium ${
                      day.hours === 'Stengt' ? 'text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    {day.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-amber-100">
              <p className="text-center text-gray-600">
                For timebestilling, ring oss på{' '}
                <a
                  href="tel:22355700"
                  className="text-amber-700 font-semibold hover:text-amber-800 transition-colors"
                >
                  22 35 57 00
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
