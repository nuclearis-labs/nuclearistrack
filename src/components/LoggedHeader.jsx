import React, { useState } from 'react';
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
import useWeb3 from '../hooks/useWeb3';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function LoggedHeader(props) {
  const [web3] = useWeb3();
  const [isUser, user] = useAuth();

  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);
  function resetDropdown() {
    setIndexDropdownOpened(false);
  }

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <Link to="/">
            <Logo />
          </Link>
        </NavLogo>

        <NavPhrase>
          <I18n t="header.navloggedPhrase" />
        </NavPhrase>
        <OutsideClickHandler onOutsideClick={resetDropdown} display="contents">
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
          {web3 && isUser && user && (
            <>
              <UserName>{web3.utils.hexToAscii(user.name)}</UserName>

              <UserName>{`${user.address.substr(0, 4)}...${user.address.substr(
                -4
              )}`}</UserName>
            </>
          )}
        </NavUser>
      </NavHeader>
    </Nav>
  );
}
