// benefits.js
import React from 'react';
import Footer from '../components/Footer';
import styled from 'styled-components';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  ItemDesc,
  BottomSpace,
} from '../styles/webComponents';
import bg from '../img/bgBeneficios.jpg';
import I18n from '../i18n';
import { RouteProps } from 'react-router';

const WebTopBenefits = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function Benefits(props: RouteProps) {
  return (
    <>
      <WebTopBenefits>
        <WidthContent>
          <WebTopTit>
            <I18n t="benefits.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopBenefits>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <ItemTit id="security">
          <I18n t="benefits.security.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              props.location,
              'benefits.security.text'
            ),
          }}
        ></ItemDesc>
        <ItemTit id="availability">
          <I18n t="benefits.availability.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              props.location,
              'benefits.availability.text'
            ),
          }}
        ></ItemDesc>

        <ItemTit id="control">
          <I18n t="benefits.control.title" />
        </ItemTit>
        <ItemDesc
          dangerouslySetInnerHTML={{
            __html: I18n.getTranslation(
              props.location,
              'benefits.control.text'
            ),
          }}
        ></ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
