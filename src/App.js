import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import PredictionHistory from './pages/Dashboard';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import AboutPage from './pages/AboutPage';
import { PredictionProvider } from './context/PredictionContext';



import MyThemeProvider from './MyThemeProvider';

function App() {
  return (
    <PredictionProvider>
    <MyThemeProvider>
     
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/dashboard" element={<PredictionHistory />} />
          <Route path="/disease-info" element={<DiseaseInfoPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
 
    </MyThemeProvider>
    </PredictionProvider>
  );
}

export default App;
