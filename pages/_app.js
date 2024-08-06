// pages/_app.js
import '../app/globals.css';
import Sidebar from '../components/Sidebar';
import { ThemeProvider } from '../context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';
import { CityContext } from '../context/CityContext';
import withCityContext from '../hoc/withCityContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { city } = useContext(CityContext);

  // Effect to navigate to the weather page when the city changes
  useEffect(() => {
    if (city) {
      router.push(`/weather?city=${city}`);
    }
  }, [city, router]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="content">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default withCityContext(MyApp);
