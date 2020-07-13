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

export default function Login() {
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
              Conectando a la Blockchain...
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
            <WebTopTit>LOGIN FALLIDO</WebTopTit>
          </WidthContent>
        </WebTop>
        <WidthContent>
          <ItemTit>Requisitos</ItemTit>
          <ItemDesc>
            Para poder acceder a la plataforma se requiere proveer sus
            credenciales a través de una billetera criptografica. La cual
            resguarda sus claves secretas y provee a la plataforma con su
            información publica, lo cual permite a la plataforma consultar y
            enviar información a la Blockchain en representación de usted.
          </ItemDesc>
          <ItemTit>Extensiones disponibles</ItemTit>
          <ItemDesc>
            A continuación listamos algunas de las disponibles extensiones para
            diferentes navegadores web que cumplen con dicha funcionalidad. El
            siguiente listado se actualizará si se publican nuevas extensiones.
            <ul style={{ paddingTop: '10px' }}>
              <li>
                Metamask <a href="https://metamask.io/">(Pagina Web)</a>
              </li>
              <li>
                Nifty
                <a href="https://www.poa.network/for-users/nifty-wallet">
                  (Pagina Web)
                </a>
              </li>
            </ul>
          </ItemDesc>
          <ItemTit>Proximos pasos</ItemTit>
          <ItemDesc>
            Para obtener acceso a la plataforma, le pedimos de instalar y
            configurar una de las extensiones disponibles. Una vez configurado,
            requerimos que nos envie la dirección de una de sus cuentas a{' '}
            <a href="mailto:sistemas@nuclearis.com?subject=Request%20to%20join%20Nuclearistrack&body=I%20hereby%20ask%20you%20to%20give%20my%20company%20access%20to%20Nuclearistrack.%0D%0A%0D%0ACompany%20Name%3A%20%3CTo%20be%20filled%20out%3E%0D%0AHexadecimal%20Account%20Name%20on%20Metamask%3A%20%3CTo%20be%20filled%20out%3E%0D%0A%0D%0AThank%20you%20very%20much!">
              sistemas@nuclearis.com
            </a>
            , en conjunto con el nombre de su empresa. Luego de una breve
            habilitación en el sistema, podrá recargar la pagina para formar
            parte de la plataforma.
          </ItemDesc>
          <ItemTit>Soporte</ItemTit>
          <ItemDesc>
            En el caso que requiere soporte por parte de NUCLEARIS, por favor no
            dude en contactarnos a sistemas@nuclearis.com, o telefonicamente al
            +54 11 5263 2700.
          </ItemDesc>
        </WidthContent>
        <BottomSpace />
      </>
    );
  } else return null;
}
