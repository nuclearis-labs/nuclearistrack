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
import { useTranslation, Trans } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation(['header']);
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
          <ItemDesc>
            <Trans>login:extensionsText</Trans>
          </ItemDesc>
          <ItemTit>{t('login:proximosPasos')}</ItemTit>
          <ItemDesc>
            <Trans>login:proximosPasosText</Trans>
          </ItemDesc>
          <ItemTit>{t('login:soporte')}</ItemTit>
          <ItemDesc>{t('login:soporteText')}</ItemDesc>
        </WidthContent>
        <BottomSpace />
      </>
    );
  } else return null;
}
