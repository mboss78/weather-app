import React, { createContext, useState } from 'react'; // Importing React, createContext, and useState

// Creating the CityContext
export const CityContext = createContext();

// Creating the CityProvider component
export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(''); // State to hold the current city

  // Function to update the city state
  const setCityContext = (newCity) => {
    setCity(newCity);
  };

  // Providing the city state and the setCityContext function to the context
  return (
    <CityContext.Provider value={{ city, setCityContext }}>
      {children} {/* Rendering the children components */}
    </CityContext.Provider>
  );
};
