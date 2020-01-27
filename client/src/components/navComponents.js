// navComponents.js
import styled from 'styled-components';
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
  padding:10px;
  text-align: right;
  align-self: start;
  svg {
    margin-right: 20px;
    width:130px;
  }
`;
const NavPhrase = styled.div`
  width: 25%;
  padding:10px;
  text-align: center;
  color:#8c6239;
  font-weight:500;
  font-size:17px;
  letter-spacing:2px;
  line-height:23px;
  align-self: start;
  text-align:left;
`;
const MenuLink = styled.a``;

export { Nav, NavHeader, NavLogo, NavPhrase, MenuLink };