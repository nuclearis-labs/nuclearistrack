// header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';
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
        <Link to="/projects/add">+ PROYECTO</Link>
        <Link to="/users/add">+ USUARIO</Link>
        <Link to="/processes/add">+ PROCESO</Link>
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
        <Link to="/projects">+ PROYECTO</Link>
        <Link to="/users">+ USUARIO</Link>
        <Link to="/processes">+ PROCESO</Link>
      </SubMenuEdit>
    </div>
  );
}

function LoggedHeader(props) {
  const { logoutUser } = useContext(UserContext);
  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo />
          </MenuLink>
        </NavLogo>
        <NavPhrase>
          PLATAFORMA
          <br />
          DESCENTRALIZADA
          <br />
          DE TRAZABILIDAD
          <br />
        </NavPhrase>
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
        <NavUser>
          <User />
          <UserName>{props.user.userName}</UserName>
          <LogOut as={Link} to="/" onClick={() => logoutUser()}>
            LOGOUT
          </LogOut>
        </NavUser>
      </NavHeader>
    </Nav>
  );
}

function PublicHeader() {
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo />
          </MenuLink>
        </NavLogo>
        <NavMenu>
          <Link to="/">HOME</Link> | <Link to="/benefits">BENEFICIOS</Link> |
          <Link to="/security"> SEGURIDAD BC</Link> |{' '}
          <Link to="/faq">FAQ </Link>|<Link to="/contact"> CONTACTO</Link>
          <NavPhrase>
            PLATAFORMA
            <br />
            DESCENTRALIZADA
            <br />
            DE TRAZABILIDAD
            <br />
          </NavPhrase>
        </NavMenu>

        <NavLogin>
          <Link to="/?lang=spa" className="active">
            ESP
          </Link>{' '}
          / <Link to="/?lang=eng">ENG</Link> | <Link to="/login">LOGIN</Link>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}

export default function Header() {
  const { getCurrentUser } = useContext(UserContext);

  if (getCurrentUser()) return <LoggedHeader user={getCurrentUser()} />;
  return <PublicHeader />;
}
