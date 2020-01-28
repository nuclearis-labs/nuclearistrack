// header.js
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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
    height: 115px;
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
const SubMenuEdit = styled.div`
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
    height: 115px;
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
const LogOut = styled.a`
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
  :hover {
    color: #fff;
  }
`;

function DropDownNew(props) {

    return (
      <div>
        <AbmLink onClick={() => props.handleClick()}>
          <New />
          NUEVO
        </AbmLink>

        <SubMenuNew className={props.active ? 'open' : 'closed'}>
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
        <AbmLink>
          <Eye />
          VER / EDITAR
        </AbmLink>

        <SubMenuEdit className={props.active ? 'open' : 'closed'}>
          <Link to="/projects">+ PROYECTO</Link>
          <Link to="/users">+ USUARIO</Link>
          <Link to="/processes">+ PROCESO</Link>
        </SubMenuEdit>
      </div>
    );
  
}

function Header() {
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
          <DropDownNew></DropDownNew>
          <DropDownEdit></DropDownEdit>
        </NavAbm>
        <NavUser>
          <User />
          <UserName>Admin Nuclearis</UserName>
          <LogOut href="#">LOGOUT</LogOut>
        </NavUser>
      </NavHeader>
    </Nav>
  );
}
export default Header;
