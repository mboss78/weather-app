import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState('kph');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemperatureUnit = localStorage.getItem('temperatureUnit');
      const savedWindSpeedUnit = localStorage.getItem('windSpeedUnit');
      const savedLanguage = localStorage.getItem('language');
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';

      if (savedTemperatureUnit) setTemperatureUnit(savedTemperatureUnit);
      if (savedWindSpeedUnit) setWindSpeedUnit(savedWindSpeedUnit);
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
      setDarkMode(savedDarkMode);
      document.body.classList.toggle('dark-mode', savedDarkMode);
    }
  }, [i18n]);

  const handleTemperatureUnitChange = (e) => {
    const value = e.target.value;
    setTemperatureUnit(value);
    localStorage.setItem('temperatureUnit', value);
  };

  const handleWindSpeedUnitChange = (e) => {
    const value = e.target.value;
    setWindSpeedUnit(value);
    localStorage.setItem('windSpeedUnit', value);
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    localStorage.setItem('language', value);
    i18n.changeLanguage(value);
  };

  const handleDarkModeChange = (e) => {
    const value = e.target.checked;
    setDarkMode(value);
    localStorage.setItem('darkMode', value);
    document.body.classList.toggle('dark-mode', value);
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">{t('settings.title')}</h1>
      <div className="settings-group">
        <label className="settings-label">{t('settings.temperatureUnit')}:</label>
        <select value={temperatureUnit} onChange={handleTemperatureUnitChange} className="settings-select">
          <option value="Celsius">Celsius</option>
          <option value="Fahrenheit">Fahrenheit</option>
        </select>
      </div>
      <div className="settings-group">
        <label className="settings-label">{t('settings.windSpeedUnit')}:</label>
        <select value={windSpeedUnit} onChange={handleWindSpeedUnitChange} className="settings-select">
          <option value="kph">kph</option>
          <option value="mph">mph</option>
        </select>
      </div>
      <div className="settings-group">
        <label className="settings-label">{t('settings.language')}:</label>
        <select value={language} onChange={handleLanguageChange} className="settings-select">
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <div className="settings-group">
        <label className="settings-label">{t('Dark Mode')}:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={handleDarkModeChange}
          className="settings-checkbox"
        />
      </div>
    </div>
  );
};

export default Settings;
