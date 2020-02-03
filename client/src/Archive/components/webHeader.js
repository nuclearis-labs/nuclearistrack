// webHeader.js
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../img/logo.svg';
import { Nav, NavHeader, NavLogo, NavPhrase, MenuLink } from '../components/navComponents.js';

const NavLogin = styled.div`
  width: 25%;
  background:#4d4d4d;
  color:#a67c52;
  text-align: left;
  align-self: start;
  position:absolute;
  right:0;
  a{
    color:#a67c52;
    text-decoration:none;
  }
  a.active, a:hover{color:#fff;}
`;

const NavLoginMenu = styled.div`
  padding:15px 25px;
  font-size:12px;
  line-height:24px;
  font-weight:700;
`;

const NavLoginWhite = styled.div`
  width: 100%;
  height:70px;
  background:#fafafa;
`;

const NavMenu = styled.div`
  width: 100%;
  padding:10px;
  font-size:12px;
  line-height:24px;
  font-weight:700;
  color:#fff;
  text-align: left;
  align-self: start;
  position:relative;
  letter-spacing:1px;
  a{
    color:#ccc;
    text-decoration:none;
  }
  a.active, a:hover{color:#fff;}
  ${NavPhrase}{width:100%;padding:5px 0;}
`;

function WebHeader() {
  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink href="#">
            <Logo />
          </MenuLink>
        </NavLogo>
        <NavMenu>
          <a href="#">HOME</a> | <a href="#">BENEFICIOS</a> | <a href="#">SEGURIDAD BC</a> | <a href="#">FAQ</a> | <a href="#">CONTACTO</a>
          <NavPhrase>
          PLATAFORMA<br/>
          DESCENTRALIZADA<br/>
          DE TRAZABILIDAD<br/>
        </NavPhrase>
        </NavMenu>
        <NavLogin>
          <NavLoginMenu>
            <a href="#" className="active">ESP</a> / <a href="#">ENG</a> | <a href="#">LOGIN</a>
          </NavLoginMenu>
          <NavLoginWhite></NavLoginWhite>
        </NavLogin>
      </NavHeader>
    </Nav>
  );
}
export default WebHeader;