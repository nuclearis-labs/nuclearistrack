// benefits.js
import React from 'react';
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
import { RouteProps } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';

const WebTopBenefits = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function Benefits(props: RouteProps) {
  const { t } = useTranslation([]);

  return (
    <>
      <WebTopBenefits>
        <WidthContent>
          <WebTopTit>{t('benefits:bannerTitle')}</WebTopTit>
        </WidthContent>
      </WebTopBenefits>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <ItemTit id="security">{t('benefits:securityTitle')}</ItemTit>
        <ItemDesc>
          <Trans>benefits:securityText</Trans>
        </ItemDesc>
        <ItemTit id="availability">{t('benefits:availabilityTitle')}</ItemTit>
        <ItemDesc>
          <Trans>benefits:availabilityText</Trans>
        </ItemDesc>
        <ItemTit id="control">{t('benefits:controlTitle')}</ItemTit>
        <ItemDesc>
          <Trans>benefits:controlText</Trans>
        </ItemDesc>
      </WidthContent>
      <BottomSpace />
    </>
  );
}
