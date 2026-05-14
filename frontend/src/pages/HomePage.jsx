import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Team } from '../components/Team';
import { Pricing } from '../components/Pricing';
import { OpeningHours } from '../components/OpeningHours';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';

export const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Team />
      <Pricing />
      <OpeningHours />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
};
