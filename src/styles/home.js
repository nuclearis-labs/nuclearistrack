import styled, { keyframes } from 'styled-components';
import { WebTop, WidthContent, ItemTit, ItemDesc } from './webComponents';
import bg from '../img/bgHome.jpg';

export const WebTopHome = styled(WebTop)`
  background: url(${bg}) #1a1a1a no-repeat center;
`;

export const PhraseHome = styled.div`
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

export const TitHome = styled.div`
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
    content: ${(props: { text: string }) => `"${props.text}"`};
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
      rgba(26, 26, 26, 0.9) 0%,
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

export const fades = keyframes`
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

export const Heptagram = styled.img`
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
    display: none;
  }
`;

export const WebBottomHome = styled.div`
  background: #333;
`;

export const WidthContentHome = styled(WidthContent)`
  max-width: 767px;
`;

export const ColHome = styled.div`
  width: 33%;
  display: inline-block;
  padding: 50px 10px 10px 15px;
  vertical-align: top;
  @media (max-width: 650px) {
    width: 100%;
    padding: 10% 10% 0 10%;
  }
`;

export const ItemTitHome = styled(ItemTit)`
  color: #fff;
`;

export const ItemDescHome = styled(ItemDesc)`
  line-height: 15px;
  margin: 5px 0;
  & a {
    display: block;
    padding: 10px 0;
  }
`;

export const Icon = styled.img`
  margin-bottom: -20px;
`;
