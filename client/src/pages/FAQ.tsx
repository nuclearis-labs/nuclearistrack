import React from 'react';
import { Title } from '../styles/components';
import Footer from '../components/Footer';
import I18n from '../i18n';
import {
  WidthContent,
  ItemTit,
  ItemDesc,
  BottomSpace
} from '../styles/webComponents';

export default function FAQ() {
  return (
    <>
      <WidthContent style={{ textTransform: 'uppercase' }}>
        <Title>FAQ</Title>
        <ItemTit>Como se guardan mis archivos?</ItemTit>
        <ItemDesc>
          Los archivos recibidos se encriptan por el algoritmo "AES256".
        </ItemDesc>
        <ItemTit>Donde se guardan mis datos?</ItemTit>
        <ItemDesc>
          Los archivos se suben a la red de <a href="https://ipfs.io/">IPFS</a>
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
