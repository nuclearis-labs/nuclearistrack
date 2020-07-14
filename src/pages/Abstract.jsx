import React from 'react';
import styled from 'styled-components';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemDesc,
  ItemTit,
  BottomSpace,
} from '../styles/webComponents';
import bg from '../img/bgSeguridad.jpg';
import { useTranslation, Trans } from 'react-i18next';

const WebTopSecurity = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function Abstract({ location, locale, path }) {
  const { t } = useTranslation(['abstract']);

  return (
    <>
      <WebTopSecurity>
        <WidthContent>
          <WebTopTit>{t('abstract:bannerTitle')}</WebTopTit>
        </WidthContent>
      </WebTopSecurity>
      <WidthContent>
        <ItemTit>{t('abstract:section1Title')}</ItemTit>
        <ItemDesc>
          <Trans>abstract:section1Text</Trans>
        </ItemDesc>
        <ItemTit>{t('abstract:section2Title')}</ItemTit>
        <ItemDesc>
          <Trans>abstract:section2Text</Trans>
        </ItemDesc>
        <ItemTit>{t('abstract:section3Title')}</ItemTit>
        <ItemDesc>
          <Trans>abstract:section3Text</Trans>
        </ItemDesc>
      </WidthContent>
      <BottomSpace />
    </>
  );
}
