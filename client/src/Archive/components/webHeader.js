// webHeader.js
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../img/logo.svg';
import { Nav, NavHeader, NavLogo, MenuLink } from '../components/navComponents.js';

const NavMenuWrap = styled.div`
  
    @media (max-width: 767px) {
      position:absolute;
      z-index:10;
      top:40px;
      right:0;
      padding: 10px 30px;
      overflow:hidden;
      background:#333;
      height:0;
      transition:height .5s ease;

      &.open{height:260px;}
    }
`;

const NavMenuIcon = styled.div`
    display:none;
    position:absolute;
    top:5px;
    right:10px;
    @media (max-width: 767px) {
      display:block;
      & div{
        width: 35px;
        height: 5px;
        background-color: #a67c52;
        margin: 6px 0;
      }
    }
`;

const NavLogin = styled.div`
  width: 25%;
  background:#4d4d4d;
  color:#a67c52;
  text-align: left;
  align-self: start;
  position:absolute;
  right:0;
  top:0;
  a{
    color:#a67c52;
    text-decoration:none;
  }
  a.active, a:hover{color:#fff;}
  @media (max-width: 767px) {
    position:relative;
    color:transparent;
    font-size:0;
    background:transparent;
    padding-top:10px;
    a{
      color:#a67c52;
      font-size:12px;
    }
  }
`;

const NavLoginMenu = styled.div`
  padding:15px 25px;
  font-size:12px;
  line-height:18px;
  font-weight:700;
  @media (max-width: 767px) {
    padding:0;
    line-height:15px;
  }
`;

const NavMenu = styled.div`
  width: 100%;
  padding:10px 0;
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
  @media (max-width: 767px) {
    color:transparent; font-size:0; line-height:15px;
    border-bottom:1px solid #999;
    a{
      display:block;
      line-height:12px;
      color:#fff;
      font-size:12px;
    }
  }
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
        <NavMenuIcon>
          <div></div>
          <div></div>
          <div></div>
        </NavMenuIcon>
        <NavMenuWrap>
          <NavMenu>
            <a href="#">HOME</a> | <a href="#">BENEFICIOS</a> | <a href="#">SEGURIDAD BC</a> | <a href="#">FAQ</a> | <a href="#">CONTACTO</a>
          </NavMenu>
          <NavLogin>
            <NavLoginMenu>
              <a href="#" className="active">ESP</a> / <a href="#">ENG</a> | <a href="#">LOGIN</a>
            </NavLoginMenu>
          </NavLogin>
        </NavMenuWrap>
      </NavHeader>
    </Nav>
  );
}
export default WebHeader;