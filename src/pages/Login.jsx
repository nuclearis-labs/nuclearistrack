import React from 'react';
import styled from 'styled-components';
import { WebTop, WidthContent, WebTopTit } from '../styles/webComponents';
import Footer from '../components/Footer';
import useWeb3 from '../hooks/useWeb3';
import mask from '../img/metamask.png';
import PublicHeader from '../components/PublicHeader';
import LoggedHeader from '../components/LoggedHeader';

const Metamask = styled.img`
  display: block;
  width: 50%;
  padding-top: 30px;
`;

export default function Login() {
  const [web3] = useWeb3();

  if (web3 === null) {
    return (
      <>
        <PublicHeader />
        <WebTop>
          <WidthContent>
            <WebTopTit style={{ paddingBottom: '100px' }}>
              Para poder acceder por favor descargue Metamask
              <a href="https://metamask.io/">
                <Metamask src={mask} />
              </a>
            </WebTopTit>
          </WidthContent>
        </WebTop>
        <Footer />
      </>
    );
  } else if (web3 === undefined)
    return (
      <>
        <PublicHeader />
        <WebTop>
          <WidthContent>
            <WebTopTit style={{ paddingBottom: '150px' }}>
              Conectando a la Blockchain...
            </WebTopTit>
          </WidthContent>
        </WebTop>
        <Footer />
      </>
    );
  else {
    return (
      <>
        <LoggedHeader />
        <WebTop>
          <WidthContent>
            <WebTopTit style={{ paddingBottom: '150px' }}>Conectado!</WebTopTit>
          </WidthContent>
        </WebTop>
        <Footer />
      </>
    );
  }
}
