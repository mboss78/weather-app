import React from 'react'; 
import { CityProvider } from '../context/CityContext'; 

// Creating a higher-order component that wraps the given component with CityProvider
const withCityContext = (Component) => (props) => (
  <CityProvider>
    <Component {...props} /> {}
  </CityProvider>
);

export default withCityContext; 
