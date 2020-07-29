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
import { useTranslation, Trans } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <FooterBg>
      <FooterWrap>
        <FooterLeft>
          <Logo style={{ position: 'relative', bottom: '5px' }} />
          <br />
          <Trans>footer:phrase</Trans>
          <br />
        </FooterLeft>
        <FooterRight>
          © {new Date().getFullYear()}. Nuclearis. NRS, S.A.{' '}
          {t('footer:license')}
          <FooterLink href="http://www.nuclearis.com">
            WWW.NUCLEARIS.COM
          </FooterLink>
        </FooterRight>
      </FooterWrap>
    </FooterBg>
  );
}
