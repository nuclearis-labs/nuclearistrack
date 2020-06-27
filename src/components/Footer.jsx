// footer.js
import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../img/logo.svg';

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

  color: #999;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 1px;
`;
const FooterLeft = styled.div`
  width: 33.333%;
  text-align: right;
  svg {
    filter: grayscale(1);
    width: 100px;
  }
`;
const FooterRight = styled.div`
  width: 66.666%;
  text-align: left;
  color: #999;
  font-size: 11px;
  align-self: start;
  margin-left: 10px;
`;
const FooterLink = styled.a`
  text-align: left;
  color: #999;
  text-decoration: none;
  display: block;
`;
export default function Footer() {
  return (
    <FooterBg>
      <FooterWrap>
        <FooterLeft>
          <Logo style={{ position: 'relative', bottom: '5px' }} />
          <br />
          INGENIERÍA Y FABRICACIÓN DE
          <br />
          COMPONENTES MECÁNICOS PARA LA
          <br />
          INDUSTRIA NUCLEAR
          <br />
        </FooterLeft>
        <FooterRight>
          © {new Date().getFullYear()}. Nuclearis. NRS, S.A. Todos los derechos
          reservados.
          <FooterLink href="http://www.nuclearis.com">
            WWW.NUCLEARIS.COM
          </FooterLink>
        </FooterRight>
      </FooterWrap>
    </FooterBg>
  );
}
