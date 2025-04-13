import React from 'react';
import { useTranslation } from 'react-i18next';


const Home: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div>
      <h2>{t("Boards")}</h2>
      <p>{t("By registering and logging in you get access to your columns.")}</p>
    </div>
  );
};

export default Home;
