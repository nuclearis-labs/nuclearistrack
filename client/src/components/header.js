// header.js
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as New } from '../img/new.svg';
import { ReactComponent as User } from '../img/user.svg';
import { ReactComponent as Logo } from '../img/logo.svg';
import {
  Nav,
  NavHeader,
  NavLogo,
  NavPhrase,
  MenuLink
} from '../components/navComponents.js';

const NavAbm = styled.div`
  width: 25%;
  padding: 10px;
  background: #333;
  text-align: left;
  align-self: start;
  background: #666666;
  color: #333;
  height: 70px;
  position: relative;
  letter-spacing: 1px;
`;
const AbmLink = styled.button`
  color: #333;
  background: transparent;
  border: none;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 700;
  display: block;
  line-height: 23px;
  width: 100%;
  text-align: left;
  :focus {
    outline: none;
  }
  :hover {
    color: #000;
  }
  svg {
    width: 23px;
    margin-right: 5px;
    vertical-align: top;
  }
  svg .st0 {
    fill: #333;
  }
  :hover svg .st0 {
    fill: #000;
  }
`;
const SubMenuNew = styled.div`
  background: #8c6239;
  line-height: 23px;
  position: absolute;
  top: 35px;
  left: 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
  height: 0;
  transition: all 0.5s ease;
  &.open {
    padding: 10px 0;
    height: 90px;
  }
  a {
    color: #fff;
    font-size: 12px;
    text-decoration: none;
    font-weight: 700;
    display: block;
    padding-left: 30px;
    letter-spacing: 1px;
  }
  a:hover {
    color: #333;
  }
`;
const SubMenuView = styled.div`
  background: #8c6239;
  line-height: 23px;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
  height: 0;
  transition: all 0.5s ease;
  &.open {
    padding: 10px 0;
    height: 90px;
  }
  a {
    color: #fff;
    font-size: 12px;
    text-decoration: none;
    font-weight: 700;
    display: block;
    padding-left: 30px;
    letter-spacing: 1px;
  }
  a:hover {
    color: #333;
  }
`;
const NavUser = styled.div`
  width: 25%;
  padding: 10px;
  background: #333;
  text-align: right;
  align-self: start;
  position: relative;
  svg {
    width: 28px;
    position: absolute;
    top: 10px;
    left: 20px;
  }
  svg .st0 {
    fill: #8c6239;
  }
`;
const UserName = styled.div`
  color: #fff;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
  padding-left: 50px;
  line-height: 12px;
  font-weight: 700;
  display: block;
  width: 100%;
  text-align: left;
  text-transform: uppercase;
`;
const LogOut = styled.p`
  color: #8c6239;
  font-family: Montserrat, sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-decoration: none;
  letter-spacing: 1px;
  text-align: left;
  width: 100%;
  float: left;
  padding: 1px 50px;
  cursor: pointer;
  :hover {
    color: #ffffff;
  }
`;

function DropDownNew() {
  const [active, setActive] = useState(false);

  return (
    <div>
      <AbmLink onClick={() => setActive(!active)}>
        <New />
        NUEVO
      </AbmLink>

      <SubMenuNew className={active ? 'open' : 'closed'}>
        <Link
          to="/projects/add"
          onClick={() => {
            setActive(false);
          }}
        >
          + PROYECTO
        </Link>

        <Link
          to="/users/add"
          onClick={() => {
            setActive(false);
          }}
        >
          + USUARIO
        </Link>
        <Link
          to="/processes/add"
          onClick={() => {
            setActive(false);
          }}
        >
          + PROCESO
        </Link>
      </SubMenuNew>
    </div>
  );
}
function DropDownView() {
  const [active, setActive] = useState(false);

  return (
    <div>
      <AbmLink onClick={() => setActive(!active)}>
        <Eye />
        VER / EDITAR
      </AbmLink>

      <SubMenuView className={active ? 'open' : 'closed'}>
        <Link
          to="/projects"
          onClick={() => {
            setActive(false);
          }}
        >
          + PROYECTO
        </Link>

        <Link
          to="/users"
          onClick={() => {
            setActive(false);
          }}
        >
          + USUARIO
        </Link>
        <Link
          to="/processes"
          onClick={() => {
            setActive(false);
          }}
        >
          + PROCESO
        </Link>
      </SubMenuView>
    </div>
  );
}

function Header() {
  const { logoutUser, contextUser } = useContext(UserContext);

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink href="#">
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
          <DropDownNew></DropDownNew>
          <DropDownView></DropDownView>
        </NavAbm>
        {contextUser.hasOwnProperty('userEmail') ? (
          <NavUser>
            <User />
            <UserName>Admin Nuclearis</UserName>
            <LogOut onClick={logoutUser}>LOGOUT</LogOut>
          </NavUser>
        ) : (
          ''
        )}
      </NavHeader>
    </Nav>
  );
}
export default Header;
