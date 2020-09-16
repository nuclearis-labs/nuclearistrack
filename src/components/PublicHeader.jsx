import React from 'react';
import {
  Nav,
  NavHeader,
  NavLogo,
  NavMenu,
  NavLogin,
  LanguageSelector,
} from '../styles/Nav';
import { ReactComponent as Logo } from '../img/logo.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function PublicHeader() {
  const { t, i18n } = useTranslation(['header']);

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <Link to="/">
            <Logo style={{ width: '150px', marginTop: '3px' }} />
          </Link>
        </NavLogo>
        <NavMenu>
          <Link to="/">{t('home')}</Link> |{' '}
          <Link to="/benefits">{t('benefits')}</Link> |
          <Link to="/abstract"> {t('abstract')}</Link> |{' '}
          <Link to="/faq">FAQ </Link>|<Link to="/contact"> {t('contact')}</Link>
        </NavMenu>

        <NavLogin>
          <LanguageSelector onClick={() => i18n.changeLanguage('es')}>
            ES
          </LanguageSelector>{' '}
          /{' '}
          <LanguageSelector onClick={() => i18n.changeLanguage('en')}>
            EN
          </LanguageSelector>{' '}
          /{' '}
          <LanguageSelector onClick={() => i18n.changeLanguage('de')}>
            DE
          </LanguageSelector>{' '}
          | <Link to="/login"> {t('login')}</Link>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}
