// PredictionContext.js
import React, { createContext, useContext, useState } from 'react';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [predictions, setPredictions] = useState([]);

  const addPrediction = (prediction) => {
    // Prepend so that the latest prediction shows first.
    setPredictions(prev => [prediction, ...prev]);
  };

  return (
    <PredictionContext.Provider value={{ predictions, addPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictions = () => useContext(PredictionContext);
