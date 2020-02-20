// footer.js
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../img/logo.svg';


const Inspiration = styled.div`
  font-family: Montserrat, sans-serif;
  position:relative;
  top:-24px;
  margin:0 auto;
  text-align:center;
  color: #8c6239;
  font-size: 25px;
  letter-spacing:10px;
  font-weight:700;
`;

const FooterBg = styled.div`
  background-color: #4d4d4d;
`;
const FooterWrap = styled.div`
  max-width: 768px;
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 auto;

  color:#999;
  font-size:11px;
  line-height:20px;
  letter-spacing:1px;
  @media (max-width: 640px) {
    display:block;
    max-width: 240px;
  }
`;
const FooterLeft = styled.div`
  width: 33.333%;
  text-align: right;
  svg {
    filter: grayscale(1);
    width:100px;
  }
  @media (max-width: 640px) {
    width: 200px;
    text-align: left;
  }
`;
const FooterRight = styled.div`
  width: 66.666%;
  text-align: left;
  color:#999;
  font-size:11px;
  align-self: start;
  margin-left: 10px;
  @media (max-width: 640px) {
    width: 180px;
    margin-top:10px;
    margin-left: 0px;
  }
`;
const FooterLink = styled.a`
  text-align: left;
  color:#999;
  text-decoration:none;
  display:block;
`;
function Footer() {
  return (
    <FooterBg>
      <Inspiration>
        NUCLEAR INSPIRATION
      </Inspiration>
      <FooterWrap>
        <FooterLeft>
            <Logo /><br/>
            INGENIERÍA Y FABRICACIÓN DE<br/>
            COMPONENTES MECÁNICOS PARA LA<br/>
            INDUSTRIA NUCLEAR<br/>
        </FooterLeft>
        <FooterRight>
          © 2019. Nuclearis. NRS, S.A. Todos los derechos reservados. 
          <FooterLink href="WWW.NUCLEARIS.COM">WWW.NUCLEARIS.COM</FooterLink>
        </FooterRight>
      </FooterWrap>
    </FooterBg>
  );
}
export default Footer;