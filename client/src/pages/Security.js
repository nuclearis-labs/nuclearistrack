import React from 'react';
import styled from 'styled-components';
import { Title } from '../components/components';
import Footer from '../components/footer.js';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  LongTxt,
  BottomSpace
} from '../components/webComponents.js';
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
        <LongTxt>
          {I18n.getTranslation(
            location,
            'security.first_paragraph'
          ).toUpperCase()}
          <br />
          <br />
          {I18n.getTranslation(
            location,
            'security.second_paragraph'
          ).toUpperCase()}
          <br />
          <br />
          {I18n.getTranslation(
            location,
            'security.third_paragraph'
          ).toUpperCase()}
        </LongTxt>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
