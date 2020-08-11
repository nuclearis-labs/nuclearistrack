import styled from 'styled-components';

export const NavAbm = styled.div`
  width: 25%;
  padding: 10px;
  background: #333;
  text-align: left;
  align-self: start;
  background: #666666;
  color: #333;
  height: auto;
  position: relative;
  letter-spacing: 1px;
`;

export const LanguageSelector = styled.span`
  cursor: pointer;
`;

export const AbmLink = styled.button`
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
export const SubMenuNew = styled.div`
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
    height: auto;
    z-index: 10;
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
export const SubMenuEdit = styled.div`
  background: #8c6239;
  line-height: 23px;
  position: absolute;
  left: 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
  height: 0;
  transition: all 0.5s ease;
  &.open {
    padding: 10px 0;
    height: auto;
    z-index: 10;
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
export const NavUser = styled.div`
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
export const UserName = styled.div`
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
export const LogOut = styled.span`
  color: #8c6239;
  cursor: pointer;
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
    text-decoration: underline;
  }
`;

export const NavLogin = styled.div`
  width: 25%;
  padding: 10px;
  background: #4d4d4d;
  color: #a67c52;
  text-align: left;
  align-self: start;
  position: relative;
  a {
    color: #a67c52;
    text-decoration: none;
  }
  a.active,
  a:hover {
    color: #fff;
  }
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export const NavMenu = styled.div`
  width: 100%;
  padding: 10px;
  font-size: 12px;
  line-height: 24px;
  font-weight: 700;
  color: #fff;
  text-align: left;
  align-self: start;
  position: relative;
  letter-spacing: 1px;
  a {
    color: #ccc;
    text-decoration: none;
  }
  a.active,
  a:hover {
    color: #fff;
  }
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const Nav = styled.div`
  background-color: #333;
  font-family: 'Montserrat', sans-serif;
`;
export const NavHeader = styled.div`
  max-width: 1010px;
  padding: 0 20px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
  }
`;
export const NavLogo = styled.div`
  width: 25%;
  padding: 10px;
  text-align: right;
  align-self: start;
  svg {
    margin-right: 20px;
    width: 130px;
  }
  @media (max-width: 768px) {
    width: unset;
    svg {
      margin-right: 0;
    }
    margin: auto;
  }
`;
export const NavPhrase = styled.div`
  width: 30%;
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

export const MenuLink = styled.a``;
