import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styled, { keyframes } from 'styled-components';
import { Title, Wrap } from '../components/components.js';
import {
  WebTop,
  WidthContent,
  BottomSpace,
  ItemTit,
  ItemDesc
} from '../components/webComponents.js';
import bg from '../img/bgHome.jpg';
import Icon1 from '../img/icon1.png';
import Icon2 from '../img/icon2.png';
import Icon3 from '../img/icon3.png';
import Hept1 from '../img/hept1.png';
import Hept2 from '../img/hept2.png';
import Hept3 from '../img/hept3.png';
import Hept4 from '../img/hept4.png';
import Hept5 from '../img/hept5.png';
import Hept6 from '../img/hept6.png';
import Hept7 from '../img/hept7.png';

const WebTopHome = styled(WebTop)`
  background: url(${bg}) #1a1a1a no-repeat center;
`;

const PhraseHome = styled.div`
  color: #a67c52;
  font-weight: 300;
  font-size: 26px;
  line-height: 34px;
  letter-spacing: 4px;
  max-width: 330px;
  text-align: right;
  padding-top: 50px;
  margin-left: 130px;
  @media (max-width: 580px) {
    font-size: 21px;
    padding-top: 30px;
    letter-spacing: 3px;
    margin-left: 10%;
    max-width: 260px;
  }
`;

const TitHome = styled.div`
  position: relative;
  top: -70px;
  color: #fff;
  font-weight: 700;
  font-size: 67px;
  line-height: 73px;
  letter-spacing: 5px;
  width: 100%;
  text-align: center;
  display: inline-block;
  & span {
    display: block;
    margin: 0;
    padding: 0;
  }
  &::before {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    content: 'BLOCKCHAIN';
    top: 125px;
    transform: scale(1, -1);
    backface-visibility: visible;
    z-index: 1;
  }
  &::after {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    content: '';
    top: -10px;
    left: 0;
    width: 100%;
    height: 60px;
    background-image: linear-gradient(
      to bottom,
      rgba(26, 26, 26, 0.6) 0%,
      rgba(26, 26, 26, 1) 90%
    );
    z-index: 2;
  }
  @media (max-width: 580px) {
    font-size: 40px;
    &::before {
      top: 105px;
    }
    &::after {
      top: -20px;
    }
  }
`;

const fades = keyframes`
  0% {
    opacity: 1;
  }
  10% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

const Heptagram = styled.img`
  position: absolute;
  top: 205px;
  left: 375px;
  z-index: 3;
  animation: 4s ${fades} ease-out infinite;
  &.hept6 {
    animation-delay: 0.2s;
  }
  &.hept5 {
    animation-delay: 0.4s;
  }
  &.hept4 {
    animation-delay: 0.6s;
  }
  &.hept3 {
    animation-delay: 0.8s;
  }
  &.hept2 {
    animation-delay: 1s;
  }
  &.hept1 {
    animation-delay: 1.2s;
  }
  @media (max-width: 767px) {
    left: 50%;
  }
  @media (max-width: 580px) {
    margin-left: -200px;
  }
`;

const WebBottomHome = styled.div`
  background: #333;
`;

const GoldTitle = styled(Title)`
  color: #8c6239;
`;

const WidthContentHome = styled(WidthContent)`
  max-width: 767px;
`;

const ColHome = styled.div`
  width: 33%;
  display: inline-block;
  padding: 50px 10px 10px 15px;
  vertical-align: top;
  @media (max-width: 650px) {
    width: 100%;
    padding: 10% 10% 0 10%;
  }
`;

const ItemTitHome = styled(ItemTit)`
  color: #fff;
`;

const ItemDescHome = styled(ItemDesc)`
  line-height: 15px;
  margin: 5px 0;
  & a {
    display: block;
    padding: 10px 0;
  }
`;

const Icon = styled.img`
  margin-bottom: -20px;
`;

function Home() {
  return (
    <>
      <Header />
      <Wrap>
        <WebTopHome>
          <WidthContentHome>
            <PhraseHome>
              PLATAFORMA DESCENTRALIZADA DE TRAZABILIDAD CON TECNOLOGIA
            </PhraseHome>
            <TitHome>BLOCKCHAIN</TitHome>
            <Heptagram src={Hept1} className="hept1" />
            <Heptagram src={Hept2} className="hept2" />
            <Heptagram src={Hept3} className="hept3" />
            <Heptagram src={Hept4} className="hept4" />
            <Heptagram src={Hept5} className="hept5" />
            <Heptagram src={Hept6} className="hept6" />
            <Heptagram src={Hept7} className="hept7" />
          </WidthContentHome>
        </WebTopHome>
        <WebBottomHome>
          <WidthContentHome>
            <ColHome>
              <Icon src={Icon1} />
              <ItemTitHome>SEGURIDAD</ItemTitHome>
              <ItemDescHome>
                SISTEMA ENCRIPTADO CON TECNOLOGIA BLOCKCHAIN, EL NUEVO ESTANDARD
                DE SEGURIDAD INFORMATICA.
                <a href="#">CONOCER +</a>
              </ItemDescHome>
            </ColHome>
            <ColHome>
              <Icon src={Icon2} />
              <ItemTitHome>DISPONIBILIDAD DE LA INFORMACION</ItemTitHome>
              <ItemDescHome>
                CON SOLO INGRESAR EN LA PLATAFORMA TIENE DISPONIBILIDAD DE TODOS
                LOS PROCESOS Y CERTIFICADOS.
                <a href="#">CONOCER +</a>
              </ItemDescHome>
            </ColHome>
            <ColHome>
              <Icon src={Icon3} />
              <ItemTitHome>CONTROL</ItemTitHome>
              <ItemDescHome>
                INFORMACION EN TIEMPO REAL DE LOS PROCESOS DE FABRICACION.
                <a href="#">CONOCER +</a>
              </ItemDescHome>
            </ColHome>
            <BottomSpace></BottomSpace>
          </WidthContentHome>
        </WebBottomHome>
      </Wrap>
      <Footer />
    </>
  );
}
export default Home;
