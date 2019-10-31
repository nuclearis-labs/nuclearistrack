import React from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1>{t('Welcome')}</h1>
    </div>
  );
}

export default Home;
