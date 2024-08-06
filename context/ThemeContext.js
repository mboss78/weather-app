import { createContext, useState, useEffect } from 'react'; 

// Creating the ThemeContext
export const ThemeContext = createContext();

// Creating the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // State to hold the current theme

  useEffect(() => {
    // On initial render, check for a saved theme in localStorage and set it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []); // Empty dependency array ensures this runs only once

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'; // Determine the new theme
    setTheme(newTheme); // Update the state
    localStorage.setItem('theme', newTheme); // Save the new theme to localStorage
  };

  // Providing the theme state and the toggleTheme function to the context
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div> {}
    </ThemeContext.Provider>
  );
};
