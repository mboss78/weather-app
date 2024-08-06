import Head from 'next/head';
import Weather from '../components/Weather';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t('home.title')}</title>
        <meta name="description"  />
      </Head>
      <main className="main-container">
        <h1>{t('home.title')}</h1>
        <Weather />
      </main>
    </div>
  );
}
