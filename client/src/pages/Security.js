import React from 'react';
import styled from 'styled-components';
import Header from '../components/header.js';
import { Title, Wrap } from '../components/components';
import { Top, Form, FormWrap } from '../components/form.js';
import Footer from '../components/footer.js';
import {
  NavPhraseFixed,
  WebTop,
  WidthContent,
  WebTopTit,
  ItemTit,
  LongTxt,
  BottomSpace
} from '../components/webComponents.js';
import bg from '../img/bgSeguridad.jpg';
import I18n from '../i18n';

const WebTopSecurity = styled(WebTop)`
  height: 396px;
  background: url(${bg}) #000 no-repeat center;
`;

const GoldTitle = styled(Title)`
  color: #8c6239;
`;

export default function Security() {
  return (
    <>
      <WebTopSecurity>
        <WidthContent>
          <WebTopTit>
            <I18n t="security.bannerTitle" />
          </WebTopTit>
        </WidthContent>
      </WebTopSecurity>
      <WidthContent>
        <GoldTitle>
          <I18n t="security.title" />
        </GoldTitle>
        <LongTxt>
          BLOCKCHAIN ES UNA TECNOLOGÍA QUE PERMITE LA TRANSFERENCIA DE DATOS
          DIGITALES CON UNA CODIFICACIÓN MUY SOFISTICADA Y DE UNA MANERA
          COMPLETAMENTE SEGURA. SERÍA COMO EL LIBRO DE ASIENTOS DE CONTABILIDAD
          DE UNA EMPRESA EN DONDE SE REGISTRAN TODAS LAS ENTRADAS Y SALIDAS DE
          DINERO; EN ESTE CASO HABLAMOS DE UN LIBRO DE ACONTECIMIENTOS
          DIGITALES.
          <br />
          <br />
          PERO ADEMÁS, CONTRIBUYE CON UNA TREMENDA NOVEDAD: ESTA TRANSFERENCIA
          NO REQUIERE DE UN INTERMEDIARIO CENTRALIZADO QUE IDENTIFIQUE Y
          CERTIFIQUE LA INFORMACIÓN, SINO QUE ESTÁ DISTRIBUIDA EN MÚLTIPLES
          NODOS INDEPENDIENTES ENTRE SÍ QUE LA REGISTRAN Y LA VALIDAN SIN
          NECESIDAD DE QUE HAYA CONFIANZA ENTRE ELLOS. UNA VEZ INTRODUCIDA, LA
          INFORMACIÓN NO PUEDE SER BORRADA, SOLO SE PODRÁN AÑADIR NUEVOS
          REGISTROS, Y NO SERÁ LEGITIMADA A MENOS QUE LA MAYORÍA DE ELLOS SE
          PONGAN DE ACUERDO PARA HACERLO.
          <br />
          <br />
          JUNTO AL NIVEL DE SEGURIDAD QUE PROPORCIONA ESTE SISTEMA FRENTE A
          HACKEOS, ENCONTRAMOS OTRA ENORME VENTAJA: AUNQUE LA RED SE CAYERA, CON
          QUE SOLO UNO DE ESOS ORDENADORES O NODOS NO LO HICIERA, LA INFORMACIÓN
          NUNCA SE PERDERÍA O EL SERVICIO, SEGÚN EL CASO DEL QUE HABLEMOS,
          SEGUIRÍA FUNCIONANDO.
        </LongTxt>
      </WidthContent>
      <BottomSpace></BottomSpace>
      <Footer />
    </>
  );
}
