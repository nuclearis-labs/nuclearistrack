import React from 'react';
import { Nav, NavHeader, NavLogo, NavMenu, NavLogin } from '../styles/Nav';
import { ReactComponent as Logo } from '../img/logo.svg';
import { Link, NavLink } from 'react-router-i18n';
import I18n from '../i18n';

export default function PublicHeader() {
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <Link to="/">
            <Logo style={{ width: '150px', marginTop: '7px' }} />
          </Link>
        </NavLogo>
        <NavMenu>
          <NavLink to="/">
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
          <Link>ES</Link> / <Link>EN</Link> / <Link>DE</Link> |{' '}
          <NavLink to="/login">
            {' '}
            <I18n t="header.login" />
          </NavLink>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}
