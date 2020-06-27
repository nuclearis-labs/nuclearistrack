import React from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import {
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  ItemDesc,
  BottomSpace,
} from "../styles/webComponents";
import bg from "../img/bgfaq.jpg";
import I18n from "../i18n";

const WebTopFAQ = styled(WebTop)`
  height: 298px;
  background: url(${bg}) #000 no-repeat center;
`;

export default function FAQ() {
  return (
    <>
      <WebTopFAQ>
        <WidthContent>
          <WebTopTit>
            <I18n t="faq.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopFAQ>
      <WidthContent style={{ textTransform: "uppercase" }}>
        <ItemTit>Donde se guardan mis datos?</ItemTit>
        <ItemDesc>
          Qui fugiat Lorem consectetur id veniam velit consectetur consequat in.
          Lorem aute eiusmod qui anim.
        </ItemDesc>
        <ItemTit>Que datos se guardan?</ItemTit>
        <ItemDesc>
          Qui fugiat Lorem consectetur id veniam velit consectetur consequat in.
          Lorem aute eiusmod qui anim. Mollit labore aute amet aute dolor id
          veniam tempor aute ex irure fugiat. Aliquip et voluptate laboris ad
          sint irure enim ad excepteur. Aliquip dolore anim deserunt et minim.
        </ItemDesc>
        <ItemTit>Quien maneja la plataforma?</ItemTit>
        <ItemDesc>
          Tempor laborum cillum occaecat elit veniam ipsum duis elit. Esse elit
          tempor laborum ipsum do commodo quis excepteur velit anim quis nostrud
          qui ipsum. Consectetur ea amet consectetur id voluptate nulla. Aliqua
          sunt occaecat elit sint qui mollit esse irure pariatur quis nostrud
          quis. Ea sint officia esse anim in elit nisi anim voluptate incididunt
          veniam. Velit proident labore culpa occaecat mollit elit excepteur
          fugiat laboris eu non enim.
        </ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>

      <Footer />
    </>
  );
}
