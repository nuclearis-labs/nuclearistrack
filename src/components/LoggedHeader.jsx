import React, { useState, useContext } from 'react';
import {
  Nav,
  NavHeader,
  NavLogo,
  NavPhrase,
  NavAbm,
  NavUser,
  UserName,
} from '../styles/Nav';
import { ReactComponent as Logo } from '../img/logo.svg';
import I18n from '../i18n';
import OutsideClickHandler from 'react-outside-click-handler';
import { ReactComponent as User } from '../img/user.svg';
import DropDownNew from './DropDownNew';
import DropDownEdit from './DropDownEdit';
import { DrizzleContext } from '@drizzle/react-plugin';

export default function LoggedHeader(props) {
  const { drizzle, initialized } = useContext(DrizzleContext.Context);
  const state = drizzle.store.getState();

  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);
  function resetDropdown() {
    setIndexDropdownOpened(false);
  }

  if (initialized) {
    return (
      <Nav>
        <NavHeader>
          <NavLogo>
            <Logo />
          </NavLogo>
          <NavPhrase>
            <I18n t="header.navloggedPhrase" />
          </NavPhrase>
          <OutsideClickHandler
            onOutsideClick={resetDropdown}
            display="contents"
          >
            <NavAbm>
              <DropDownNew
                index={indexDropdownOpened}
                onClick={setIndexDropdownOpened}
              />
              <DropDownEdit
                index={indexDropdownOpened}
                onClick={setIndexDropdownOpened}
              />
            </NavAbm>
          </OutsideClickHandler>
          <NavUser>
            <User />
            <UserName>{props.user.name}</UserName>
            <UserName>{`${state.accounts[0].substr(
              0,
              4
            )}...${state.accounts[0].substr(-4)}`}</UserName>
          </NavUser>
        </NavHeader>
      </Nav>
    );
  }
}
