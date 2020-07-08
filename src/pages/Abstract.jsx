import React from 'react';
import styled from 'styled-components';
import Footer from '../components/Footer';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemDesc,
  ItemTit,
  BottomSpace,
} from '../styles/webComponents';
import bg from '../img/bgSeguridad.jpg';
import I18n from '../i18n';

const WebTopSecurity = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function Abstract({ location }) {
  return (
    <>
      <WebTopSecurity>
        <WidthContent>
          <WebTopTit>
            <I18n t="abstract.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopSecurity>
      <WidthContent>
        <ItemTit>
          <I18n t="abstract.section1.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              location,
              'abstract.section1.text'
            ).toUpperCase(),
          }}
        ></ItemDesc>
        <ItemTit>
          <I18n t="abstract.section2.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              location,
              'abstract.section2.text'
            ).toUpperCase(),
          }}
        ></ItemDesc>
        <ItemTit>
          <I18n t="abstract.section3.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              location,
              'abstract.section3.text'
            ).toUpperCase(),
          }}
        ></ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
