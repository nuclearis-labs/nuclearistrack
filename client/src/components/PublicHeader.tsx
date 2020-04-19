import React from 'react';
import {
  Nav,
  NavHeader,
  NavLogo,
  MenuLink,
  NavMenu,
  NavLogin
} from '../styles/Nav';
import { ReactComponent as Logo } from '../img/logo.svg';
import { Link, NavLink } from 'react-router-i18n';
import I18n from '../i18n';
import { stripLocale } from '../utils/stripLocale';

interface PublicHeaderLocation {
  pathname: string;
}

interface PublicHeaderMatchLocale {
  locale: string;
}

interface PublicHeader {
  location: PublicHeaderLocation;
  match: {
    params: PublicHeaderMatchLocale;
  };
}

export default function PublicHeader({
  location: { pathname },
  match: {
    params: { locale }
  }
}: PublicHeader) {
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo style={{ width: '150px', marginTop: '7px' }} />
          </MenuLink>
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
          <NavLink to="/security">
            {' '}
            <I18n t="header.security" />
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
          <Link to="/login">
            {' '}
            <I18n t="header.login" />
          </Link>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}
