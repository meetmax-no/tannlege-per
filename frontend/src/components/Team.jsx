import React from 'react';
import { Star } from 'lucide-react';
import { teamMembers, testimonials } from '../data/mockData';
import { Card, CardContent } from './ui/card';

export const Team = () => {
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Møt vårt team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Erfarne og omsorgsfulle tannleger som setter din tannhelse først
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-xl"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <CardContent className="md:w-2/3 p-8">
                  <h3 className="text-2xl font-bold text-amber-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-700 font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.education}</p>
                  <div className="bg-amber-50 rounded-lg px-3 py-2 inline-block mb-4">
                    <p className="text-sm font-medium text-amber-800">
                      Spesialitet: {member.specialization}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-amber-900 mb-8 text-center">
            Hva pasientene våre sier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-lg bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-amber-100 pt-4">
                    <p className="font-semibold text-amber-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(testimonial.date).toLocaleDateString('nb-NO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
