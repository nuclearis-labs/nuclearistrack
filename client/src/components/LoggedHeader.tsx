import React, { useState } from "react";
import {
  Nav,
  NavHeader,
  NavLogo,
  NavPhrase,
  MenuLink,
  AbmLink,
  SubMenuNew,
  SubMenuEdit,
  NavAbm,
  NavUser,
  UserName,
  LogOut,
  NavMenu,
  NavLogin,
} from "../styles/Nav";
import { ReactComponent as Logo } from "../img/logo.svg";
import { Link, NavLink } from "react-router-i18n";
import I18n from "../i18n";
import OutsideClickHandler from "react-outside-click-handler";
import RoleBasedACL from "./RoleBasedACL";
import { ReactComponent as Exchange } from "../img/exchange.svg";
import { ReactComponent as User } from "../img/user.svg";
import DropDownNew from "./DropDownNew";
import DropDownEdit from "./DropDownEdit";

export default function LoggedHeader(props: any) {
  const [indexDropdownOpened, setIndexDropdownOpened] = useState(false);
  function resetDropdown() {
    setIndexDropdownOpened(false);
  }

  return (
    <Nav>
      <NavHeader>
        <NavLogo>
          <MenuLink as={Link} to="/">
            <Logo />
          </MenuLink>
        </NavLogo>
        <NavPhrase>
          <I18n t="header.navloggedPhrase" />
        </NavPhrase>
        <OutsideClickHandler onOutsideClick={resetDropdown} display="contents">
          <NavAbm>
            <RoleBasedACL
              roles={["project:create", "process:create", "user:create"]}
              {...props}
            >
              <DropDownNew
                index={indexDropdownOpened}
                onClick={setIndexDropdownOpened}
              />
            </RoleBasedACL>
            <RoleBasedACL
              roles={["project:read", "process:read", "user:read"]}
              {...props}
            >
              <DropDownEdit
                index={indexDropdownOpened}
                onClick={setIndexDropdownOpened}
              />
            </RoleBasedACL>
            <RoleBasedACL roles={["admin:transfer"]} {...props}>
              <AbmLink>
                <Link
                  to="/transfer"
                  style={{ color: "unset", textDecoration: "unset" }}
                >
                  <Exchange />
                  TRANSFER
                </Link>
              </AbmLink>
            </RoleBasedACL>
          </NavAbm>
        </OutsideClickHandler>
        <NavUser>
          <User />
          <UserName>{props.user.userName}</UserName>
          <LogOut onClick={props.logoutUser}>
            <I18n t="header.logout" />
          </LogOut>
          <LogOut as={Link} to="/settings">
            PREFERENCIAS
          </LogOut>
        </NavUser>
      </NavHeader>
    </Nav>
  );
}
