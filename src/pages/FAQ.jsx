import React from 'react';
import styled from 'styled-components';
import Footer from '../components/Footer';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  ItemDesc,
  BottomSpace,
} from '../styles/webComponents';
import bg from '../img/bgfaq.jpg';
import I18n from '../i18n';
import PublicHeader from '../components/PublicHeader';

const WebTopFAQ = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function FAQ() {
  return (
    <>
      <PublicHeader />
      <WebTopFAQ>
        <WidthContent>
          <WebTopTit>
            <I18n t="faq.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopFAQ>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <ItemTit>
          <I18n t="faq.question1" />
        </ItemTit>
        <ItemDesc>
          <I18n t="faq.answer1" />
        </ItemDesc>
        <ItemTit>
          <I18n t="faq.question2" />
        </ItemTit>
        <ItemDesc>
          <I18n t="faq.answer2" />
        </ItemDesc>
        <ItemTit>
          <I18n t="faq.question3" />
        </ItemTit>
        <ItemDesc>
          <I18n t="faq.answer3" />
        </ItemDesc>
        <ItemTit>
          <I18n t="faq.question4" />
        </ItemTit>
        <ItemDesc>
          <I18n t="faq.answer4" />
        </ItemDesc>
        <ItemTit>
          <I18n t="faq.question5" />
        </ItemTit>
        <ItemDesc>
          <I18n t="faq.answer5" />
        </ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>

      <Footer />
    </>
  );
}
