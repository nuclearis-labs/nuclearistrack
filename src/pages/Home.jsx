import React from 'react';
import { Link } from 'react-router-i18n';
import { BottomSpace } from '../styles/webComponents';
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
import I18n from '../i18n';
import {
  WebTopHome,
  WidthContentHome,
  PhraseHome,
  TitHome,
  Heptagram,
  WebBottomHome,
  ColHome,
  Icon,
  ItemDescHome,
  ItemTitHome,
} from '../styles/home';

function Home() {
  return (
    <>
      <WebTopHome>
        <WidthContentHome>
          <PhraseHome>
            <I18n t="header.navPhrase" />
          </PhraseHome>
          <TitHome text="BLOCKCHAIN">BLOCKCHAIN</TitHome>

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
            <ItemTitHome>
              <I18n t="home.security.title" />
            </ItemTitHome>
            <ItemDescHome>
              <I18n t="home.security.text" />
              <Link to="/benefits/#security">
                <I18n t="general.more" /> +
              </Link>
            </ItemDescHome>
          </ColHome>
          <ColHome>
            <Icon src={Icon2} />
            <ItemTitHome>
              <I18n t="home.availability.title" />
            </ItemTitHome>
            <ItemDescHome>
              <I18n t="home.availability.text" />
              <Link to="/benefits/#availability">
                <I18n t="general.more" /> +
              </Link>
            </ItemDescHome>
          </ColHome>
          <ColHome>
            <Icon src={Icon3} />
            <ItemTitHome>
              <I18n t="home.control.title" />
            </ItemTitHome>
            <ItemDescHome>
              <I18n t="home.control.text" />
              <Link to="/benefits/#control">
                <I18n t="general.more" /> +
              </Link>
            </ItemDescHome>
          </ColHome>
          <BottomSpace />
        </WidthContentHome>
      </WebBottomHome>
    </>
  );
}

export default Home;
