// header.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { ReactComponent as Eye } from '../img/eye.svg';
import { ReactComponent as New } from '../img/new.svg';
import { ReactComponent as Logo } from '../img/logo.svg';
const Nav = styled.div`
  background-color: #333;
  font-family: 'Montserrat', sans-serif;
`;
const NavHeader = styled.div`
  max-width: 1010px;
  padding: 0 20px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;
const NavLogo = styled.div`
  width: 25%;
  padding: 10px;
  text-align: right;
  align-self: start;
  svg {
    margin-right: 20px;
    width: 130px;
  }
`;
const NavPhrase = styled.div`
  width: 25%;
  padding: 10px;
  text-align: center;
  color: #8c6239;
  font-weight: 500;
  font-size: 17px;
  letter-spacing: 2px;
  line-height: 23px;
  align-self: start;
  text-align: left;
`;
const NavAbm = styled.div`
  width: 25%;
  padding: 10px;
  background: #333;
  text-align: left;
  align-self: start;
  background: #666666;
  color: #333;
  height: 70px;
`;
const AbmLink = styled.a`
  color: #333;
  font-size: 12px;
  text-decoration: none;
  font-weight: 700;
  display: block;
  line-height: 23px;
  svg {
    fill: #333;
    width: 23px;
    margin-right: 5px;
    vertical-align: top;
  }
`;
const NavUser = styled.div`
  color: #fff;
  width: 25%;
  padding: 10px;
  background: #333;
  text-align: right;
  align-self: start;
`;

const MenuLink = styled.a``;
function Header() {
  const { contextUser } = useContext(UserContext);

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink href="/"></MenuLink>
          <MenuLink href="/">
            <Logo />
          </MenuLink>
          <MenuLink href="#"></MenuLink>
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
          <AbmLink href="#">
            <New />
            NUEVO
          </AbmLink>
          <AbmLink href="#">
            <Eye />
            VER / EDITAR
          </AbmLink>
        </NavAbm>
        <NavUser>{contextUser.userName}</NavUser>
      </NavHeader>
    </Nav>
  );
}
export default Header;
