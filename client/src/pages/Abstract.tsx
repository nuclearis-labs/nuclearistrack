import React from 'react';
import styled from 'styled-components';
import { Title } from '../styles/components';
import Footer from '../components/Footer';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  LongTxt,
  BottomSpace
} from '../styles/webComponents';
import bg from '../img/bgSeguridad.jpg';
import I18n from '../i18n';

const WebTopSecurity = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

const GoldTitle = styled(Title)`
  color: #8c6239;
`;

export default function Security({ location }) {
  return (
    <>
      <WebTopSecurity>
        <WidthContent>
          <WebTopTit>
            <I18n t="security.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopSecurity>
      <WidthContent>
        <GoldTitle>
          <I18n t="security.title" />
        </GoldTitle>
        <LongTxt
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(location, 'security.text').toUpperCase()
          }}
        ></LongTxt>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
