import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card } from './ui/card';

export const Pricing = () => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/priser.json')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.prisliste.map(category => ({
          category: category.kategori,
          items: category.tjenester.map(item => ({
            service: item.tjeneste,
            price: item.pris
          }))
        }));
        setPriceList(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Feil ved lasting av priser:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="priser" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Laster priser...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="priser" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Priser
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oversikt over våre tjenester og priser. Kontakt oss for mer informasjon.
          </p>
        </div>

        <Card className="border-2 border-amber-100 shadow-lg">
          <Accordion type="single" collapsible className="w-full">
            {priceList.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-amber-900 hover:text-amber-700 hover:no-underline">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-4 space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-center py-3 border-b border-amber-50 last:border-0"
                      >
                        <span className="text-gray-700 font-medium">{item.service}</span>
                        <span className="text-amber-800 font-semibold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Student Offer Highlight */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-3 border-blue-400 rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              Studenttilbud
            </h3>
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-700 text-lg mb-2">
                  <strong className="text-blue-800">Undersøkelse/rtg og puss/rens</strong>
                </p>
                <p className="text-4xl font-bold text-blue-900">950,-</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-700 text-lg mb-2">
                  <strong className="text-blue-800">Rabatt på øvrig behandling</strong>
                </p>
                <p className="text-4xl font-bold text-blue-900">15%</p>
              </div>
            </div>
            <p className="text-gray-600 mt-6 italic">
              Gyldig studentbevis må fremvises ved timebestilling
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Prisene er veiledende. Kontakt oss for et nøyaktig pristilbud basert på dine behov.
          </p>
        </div>
      </div>
    </section>
  );
};
