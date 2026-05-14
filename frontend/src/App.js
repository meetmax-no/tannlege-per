import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { StudentLanding } from "./pages/StudentLanding";
import { StudentPoster } from "./pages/StudentPoster";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student" element={<StudentLanding />} />
            <Route path="/student/plakat" element={<StudentPoster />} />
          </Routes>
          <Toaster />
          <Analytics />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
