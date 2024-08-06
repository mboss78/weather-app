// pages/about.js
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t('about.title')}</title>
      </Head>
      <main className="main-container">
        <h1>{t('about.title')}</h1>
        <p>{t('about.intro')}</p>
        <section>
          <h2>{t('about.reactTitle')}</h2>
          <p>{t('about.reactDesc')}</p>
        </section>
        <section>
          <h2>{t('about.nextjsTitle')}</h2>
          <p>{t('about.nextjsDesc')}</p>
        </section>
        <section>
          <h2>{t('about.axiosTitle')}</h2>
          <p>{t('about.axiosDesc')}</p>
        </section>
      </main>
      <style jsx>{`
        .main-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          font-size: 2em;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 1.5em;
          margin-top: 20px;
        }

        p {
          font-size: 1em;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
