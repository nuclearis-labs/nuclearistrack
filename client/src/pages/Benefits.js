// benefits.js
import React from 'react';
import Footer from '../components/footer.js';
import styled from 'styled-components';
import { Title } from '../components/components.js';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  ItemDesc,
  BottomSpace
} from '../components/webComponents.js';
import bg from '../img/bgBeneficios.jpg';
import I18n from '../i18n';

const WebTopBenefits = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function Benefits() {
  return (
    <>
      <WebTopBenefits>
        <WidthContent>
          <WebTopTit>
            <I18n t="benefits.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopBenefits>
      <WidthContent>
        <Title>
          <I18n t="benefits.title" />
        </Title>
        <ItemTit>
          <I18n t="benefits.security.title" />
        </ItemTit>
        <ItemDesc>
          <I18n t="benefits.security.text" />
        </ItemDesc>

        <ItemTit>
          <I18n t="benefits.availability.title" />
        </ItemTit>
        <ItemDesc>
          <I18n t="benefits.availability.text" />
        </ItemDesc>

        <ItemTit>
          <I18n t="benefits.control.title" />
        </ItemTit>
        <ItemDesc>
          <I18n t="benefits.control.text" />
        </ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
