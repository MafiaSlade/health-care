import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import ImageAnalysis from './Pages/ImageAnalysis'; // New component for image analysis

function App() {
  return (
    <div className="App">
      <Router basename="/Health-Plus">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/image-analysis" element={<ImageAnalysis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
