import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { Pricing } from "./components/Pricing";
import { OpeningHours } from "./components/OpeningHours";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Services />
      <Team />
      <Pricing />
      <OpeningHours />
      <Contact />
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}

export default App;
