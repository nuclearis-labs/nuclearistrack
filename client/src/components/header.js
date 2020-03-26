// header.js
import React, { useState, useContext, useEffect } from 'react';

import { Link, NavLink } from 'react-router-i18n';
import { UserContext } from '../context/userContext';
import OutsideClickHandler from 'react-outside-click-handler';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as New } from '../img/new.svg';
import { ReactComponent as User } from '../img/user.svg';
import { ReactComponent as Logo } from '../img/logo.svg';
import {
  Nav,
  NavHeader,
  NavLogo,
  NavPhrase,
  MenuLink,
  AbmLink,
  SubMenuNew,
  SubMenuEdit,
  NavAbm,
  NavUser,
  UserName,
  LogOut,
  NavMenu,
  NavLogin
} from '../styles/Nav.js';
import I18n from '../i18n';

function DropDownNew(props) {
  return (
    <div>
      <AbmLink
        onClick={() => {
          props.index === false || props.index === 2
            ? props.onClick(1)
            : props.onClick(false);
        }}
      >
        <New />
        NUEVO
      </AbmLink>

      <SubMenuNew className={props.index === 1 ? 'open' : 'closed'}>
        <Link to="/projects/add" onClick={() => props.onClick(false)}>
          + <I18n t="header.projects" />
        </Link>
        <Link to="/users/add" onClick={() => props.onClick(false)}>
          + <I18n t="header.user" />
        </Link>
        <Link to="/processes/add" onClick={() => props.onClick(false)}>
          + PROCESO
        </Link>
      </SubMenuNew>
    </div>
  );
}
function DropDownEdit(props) {
  return (
    <div>
      <AbmLink
        onClick={() => {
          props.index === false ? props.onClick(2) : props.onClick(false);
        }}
      >
        <Eye />
        VER / EDITAR
      </AbmLink>

      <SubMenuEdit className={props.index === 2 ? 'open' : 'closed'}>
        <Link to="/projects" onClick={() => props.onClick(false)}>
          + PROYECTO
        </Link>
        <Link to="/users" onClick={() => props.onClick(false)}>
          + USUARIO
        </Link>
        <Link to="/processes" onClick={() => props.onClick(false)}>
          + PROCESO
        </Link>
      </SubMenuEdit>
    </div>
  );
}

function LoggedHeader(props) {
  const { logoutUser } = useContext(UserContext);
  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);

  function resetDropdown() {
    setIndexDropdownOpened(false);
  }

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo />
          </MenuLink>
        </NavLogo>
        <NavPhrase>
          <I18n t="header.navPhrase" />
        </NavPhrase>
        <OutsideClickHandler onOutsideClick={resetDropdown} display="contents">
          <NavAbm>
            <DropDownNew
              index={indexDropdownOpened}
              onClick={setIndexDropdownOpened}
            ></DropDownNew>
            <DropDownEdit
              index={indexDropdownOpened}
              onClick={setIndexDropdownOpened}
            ></DropDownEdit>
          </NavAbm>
        </OutsideClickHandler>
        <NavUser>
          <User />
          <UserName>{props.user.userName}</UserName>
          <LogOut as={Link} to="/" onClick={() => logoutUser()}>
            <I18n t="header.logout" />
          </LogOut>
          <LogOut as={Link} to="/settings">
            PREFERENCIAS
          </LogOut>
        </NavUser>
      </NavHeader>
    </Nav>
  );
}

const stripLocale = (pathname, locale) => {
  if (!locale) {
    return pathname;
  }

  return pathname.replace(`/${locale}`, '');
};

function PublicHeader({
  location: { pathname },
  match: {
    params: { locale }
  },
  history
}) {
  console.log(pathname);
  console.log(locale);
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo />
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
          <NavPhrase>
            <I18n t="header.navPhrase" />
          </NavPhrase>
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

export default function Header(props) {
  const { getCurrentUser } = useContext(UserContext);

  if (getCurrentUser())
    return <LoggedHeader {...props} user={getCurrentUser()} />;
  return <PublicHeader {...props} />;
}
