import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../App.css"

const Navigation: React.FC = () => {
  const [jwt, setJwt] = useState<string | null>(null);
  const {t, i18n } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setJwt(localStorage.getItem('token'));
    }
  }, [jwt]);

  const logout = () => {
    localStorage.removeItem('token');
    setJwt(null);
    window.location.href = '/';
  };
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">{t("Home")}</Link>
        </li>
        {!jwt ? (
          <>
            <li>
              <Link to="/login">{t("Login")}</Link>
            </li>
            <li>
              <Link to="/register">{t('Register')}</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={logout}className="logout-btn">{t("Logout")}</button>
          </li>
        )}
        <li>{}
        <Link to="/board">{t('Board')}</Link>{}</li>
        <li>
          <button onClick={() => changeLanguage('fi')}>FI</button>
          <button onClick={() => changeLanguage('en')}>EN</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
