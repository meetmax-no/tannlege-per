import React from 'react';
import { priceList } from '../data/mockData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card } from './ui/card';

export const Pricing = () => {
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

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Prisene er veiledende. Kontakt oss for et nøyaktig pristilbud basert på dine behov.
          </p>
        </div>
      </div>
    </section>
  );
};
