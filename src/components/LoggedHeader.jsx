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
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function LoggedHeader(props) {
  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);
  function resetDropdown() {
    setIndexDropdownOpened(false);
  }
  const { account, web3 } = useContext(UserContext);

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
            {account.type === '0' && (
              <DropDownNew
                user={account}
                index={indexDropdownOpened}
                onClick={setIndexDropdownOpened}
              />
            )}
            <DropDownEdit
              user={account}
              index={indexDropdownOpened}
              onClick={setIndexDropdownOpened}
            />
          </NavAbm>
        </OutsideClickHandler>
        <NavUser>
          <User />
          <UserName>{web3.utils.hexToAscii(account.name)}</UserName>
          <UserName>{`${account.address.substr(
            0,
            4
          )}...${account.address.substr(-4)}`}</UserName>
        </NavUser>
      </NavHeader>
    </Nav>
  );
}
