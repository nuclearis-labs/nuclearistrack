import React, { useContext } from 'react';
import {
  Nav,
  NavHeader,
  NavLogo,
  MenuLink,
  NavMenu,
  NavLogin,
} from '../styles/Nav';
import { ReactComponent as Logo } from '../img/logo.svg';
import { Link, NavLink } from 'react-router-i18n';
import I18n from '../i18n';
import { stripLocale } from '../utils/stripLocale';

export default function PublicHeader({
  location: { pathname },
  match: {
    params: { locale },
  },
}) {
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <Logo style={{ width: '150px', marginTop: '7px' }} />
        </NavLogo>
        <NavMenu>
          <NavLink to="/">
            {' '}
            <I18n t="header.home" />
          </NavLink>{' '}
          |{' '}
          <NavLink to="/benefits">
            <I18n t="header.benefits" />
          </NavLink>{' '}
          |
          <NavLink to="/abstract">
            {' '}
            <I18n t="header.abstract" />
          </NavLink>{' '}
          | <NavLink to="/faq">FAQ </NavLink>|
          <NavLink to="/contact">
            {' '}
            <I18n t="header.contact" />
          </NavLink>
        </NavMenu>

        <NavLogin>
          <Link ignoreLocale to={`/sp${stripLocale(pathname, locale)}`}>
            ES
          </Link>{' '}
          /{' '}
          <Link ignoreLocale to={`/en${stripLocale(pathname, locale)}`}>
            EN
          </Link>{' '}
          /{' '}
          <Link ignoreLocale to={`/de${stripLocale(pathname, locale)}`}>
            DE
          </Link>{' '}
          |{' '}
          <NavLink to="/login">
            {' '}
            <I18n t="header.login" />
          </NavLink>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}
