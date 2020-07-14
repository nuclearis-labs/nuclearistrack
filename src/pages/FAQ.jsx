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
import bg from '../img/bgfaq.jpg';
import { useTranslation } from 'react-i18next';

const WebTopFAQ = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <>
      <WebTopFAQ>
        <WidthContent>
          <WebTopTit>{t('faq:bannerTitle')}</WebTopTit>
        </WidthContent>
      </WebTopFAQ>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <ItemTit>{t('faq:question1')}</ItemTit>
        <ItemDesc>{t('faq:answer1')}</ItemDesc>
        <ItemTit>{t('faq:question2')}</ItemTit>
        <ItemDesc>{t('faq:answer2')}</ItemDesc>
        <ItemTit>{t('faq:question3')}</ItemTit>
        <ItemDesc>{t('faq:answer3')}</ItemDesc>
        <ItemTit>{t('faq:question4')}</ItemTit>
        <ItemDesc>{t('faq:answer4')}</ItemDesc>
        <ItemTit>{t('faq:question5')}</ItemTit>
        <ItemDesc>{t('faq:answer5')}</ItemDesc>
      </WidthContent>
      <BottomSpace />
    </>
  );
}
