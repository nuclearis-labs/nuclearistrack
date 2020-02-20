// benefits.js
import React from 'react';
import styled from 'styled-components';
import { Title, Wrap } from '../components/components.js';
import { NavPhraseFixed, WebTop, WidthContent, WebTopTit, ItemTit, ItemDesc, BottomSpace } from '../components/webComponents.js';
import bg from '../img/bgBeneficios.jpg';

const WebTopBenefits = styled(WebTop)`
  height:396px;
  background: url(${bg}) #000 no-repeat center;
`;

function Benefits() {
  return (
    <Wrap>
      <NavPhraseFixed>
        <div>
          PLATAFORMA
          DESCENTRALIZADA
          DE TRAZABILIDAD
        </div>
      </NavPhraseFixed>
      <WebTopBenefits>
        <WidthContent>
          <WebTopTit>
            TRANSPARENCIA EN
            TODOS NUESTROS PROCESOS
          </WebTopTit>
        </WidthContent>
      </WebTopBenefits>
      <WidthContent>
        <Title>
          BENEFICIOS
        </Title>
          <ItemTit>SEGURIDAD</ItemTit>
          <ItemDesc>SISTEMA ENCRIPTADO CON TECNOLOGIA  BLOCKCHAIN, EL NUEVO ESTANDARD DE SEGURIDAD INFORMATICA.</ItemDesc>

          <ItemTit>DISPONIBILIDAD DE LA INFORMACION</ItemTit>
          <ItemDesc>CON SOLO INGRESAR EN LA  PLATAFORMA TIENE DISPONIBILIDAD DE TODOS LOS PROCESOS Y CERTIFICADOS</ItemDesc>

          <ItemTit>CONTROL</ItemTit>
          <ItemDesc>INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION</ItemDesc>

          <ItemTit>SEGURIDAD</ItemTit>
          <ItemDesc>SISTEMA ENCRIPTADO CON TECNOLOGIA  BLOCKCHAIN, EL NUEVO ESTANDARD DE SEGURIDAD INFORMATICA.</ItemDesc>

          <ItemTit>DISPONIBILIDAD DE LA INFORMACION</ItemTit>
          <ItemDesc>CON SOLO INGRESAR EN LA  PLATAFORMA TIENE DISPONIBILIDAD DE TODOS LOS PROCESOS Y CERTIFICADOS</ItemDesc>

          <ItemTit>CONTROL</ItemTit>
          <ItemDesc>
            INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION<br/>
            <a href="#">CONOCER +</a>
          </ItemDesc>
      </WidthContent>
      <BottomSpace></BottomSpace>
    </Wrap>
  );
}
export default Benefits;