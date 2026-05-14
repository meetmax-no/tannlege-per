import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { StudentLanding } from "./pages/StudentLanding";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student" element={<StudentLanding />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
