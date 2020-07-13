// footer.js
import React from 'react';
import { ReactComponent as Logo } from '../img/logo.svg';
import {
  FooterBg,
  FooterWrap,
  FooterLeft,
  FooterRight,
  FooterLink,
} from '../styles/footer';

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
