import React from 'react';
import { Title } from '../components/components';
import Footer from '../components/footer.js';
import I18n from '../i18n';
import {
  WidthContent,
  ItemTit,
  ItemDesc,
  BottomSpace
} from '../components/webComponents.js';

export default function FAQ() {
  return (
    <>
      <WidthContent>
        <Title>FAQ</Title>
        <ItemTit>Como funciona la blockchain?</ItemTit>
        <ItemDesc>
          Voluptate velit cillum elit pariatur qui quis ea sunt do occaecat
          adipisicing aliqua sit proident. Veniam adipisicing consequat
          incididunt laborum qui nostrud. Cupidatat proident incididunt ipsum
          aliquip do.
        </ItemDesc>
        <ItemTit>Es seguro el almacenamiento de archivos?</ItemTit>
        <ItemDesc>
          Aliqua officia fugiat irure nostrud nisi sint nisi quis. Veniam
          reprehenderit nisi mollit et irure et. Mollit amet officia culpa
          tempor pariatur ea labore nostrud aute laboris ullamco.
        </ItemDesc>
        <ItemTit>Donde se guardan mis datos?</ItemTit>
        <ItemDesc>
          Laborum minim elit id ut. Sunt aute amet laborum aute eu amet
          voluptate aliqua officia culpa commodo aliqua aute culpa. Nisi et
          mollit deserunt consequat do.
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
