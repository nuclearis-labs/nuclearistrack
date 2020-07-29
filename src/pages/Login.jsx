import React, { useEffect, useContext } from 'react';
import {
  WebTop,
  WidthContent,
  WebTopTit,
  BottomSpace,
  ItemTit,
  ItemDesc,
} from '../styles/webComponents';
import { useHistory } from 'react-router';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const history = useHistory();
  const { isLoading, isReady, isConnected, connect, account } = useContext(
    UserContext
  );

  useEffect(() => {
    if (isReady) connect();
    // eslint-disable-next-line
  }, [isReady]);

  useEffect(() => {
    if (isConnected) {
      if (account.type === '2') history.push('/processes');
      else history.push('/projects');
    }
  }, [account, isConnected, history]);

  if (isLoading === true) {
    return (
      <>
        <WebTop>
          <WidthContent>
            <WebTopTit style={{ paddingBottom: '150px' }}>
              {t('login:connecting')}
            </WebTopTit>
          </WidthContent>
        </WebTop>
      </>
    );
  } else if (isLoading === false && isConnected === false) {
    return (
      <>
        <WebTop>
          <WidthContent>
            <WebTopTit>{t('login:failed')}</WebTopTit>
          </WidthContent>
        </WebTop>
        <WidthContent>
          <ItemTit>{t('login:requirements')}</ItemTit>
          <ItemDesc>{t('login:requirementsText')}</ItemDesc>
          <ItemTit>{t('login:extensions')}</ItemTit>
          <ItemDesc
            dangerouslySetInnerHTML={{
              __html: t('login:extensionsText', {
                extensiones:
                  "<ul style={{ paddingTop: '10px' }}><li>Metamask <a href='https://metamask.io/'>(Pagina Web)</a></li><li>Nifty<a href='https://www.poa.network/for-users/nifty-wallet'>(Pagina Web)</a></li></ul>",
              }),
            }}
          />
          <ItemTit>{t('login:proximosPasos')}</ItemTit>
          <ItemDesc
            dangerouslySetInnerHTML={{
              __html: t('login:proximosPasosText', {
                requestEmail:
                  "<a href='mailto:sistemas@nuclearis.com?subject=Request%20to%20join%20Nuclearistrack&body=I%20hereby%20ask%20you%20to%20give%20my%20company%20access%20to%20Nuclearistrack.%0D%0A%0D%0ACompany%20Name%3A%20%3CTo%20be%20filled%20out%3E%0D%0AHexadecimal%20Account%20Name%20on%20Metamask%3A%20%3CTo%20be%20filled%20out%3E%0D%0A%0D%0AThank%20you%20very%20much!'>sistemas@nuclearis.com</a>",
              }),
            }}
          />
          <ItemTit>{t('login:soporte')}</ItemTit>
          <ItemDesc
            dangerouslySetInnerHTML={{
              __html: t('login:soporteText', {
                email:
                  "<a href='mailto:sistemas@nuclearis.com?subject=Soporte%20NUCLEARISTRACK'>sistemas@nuclearis.com</a>",
              }),
            }}
          ></ItemDesc>
        </WidthContent>
        <BottomSpace />
      </>
    );
  } else return null;
}
