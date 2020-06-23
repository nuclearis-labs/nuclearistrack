import React from 'react';
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
  NavLogin
} from '../styles/Nav';
import RoleBasedACL from './RoleBasedACL';
import { Link, NavLink } from 'react-router-i18n';
import { ReactComponent as New } from '../img/new.svg';
import I18n from '../i18n';

export default function DropDownNew(props: any) {
  return (
    <div>
      <AbmLink
        onClick={() => {
          props.index === false || props.index === 2
            ? props.onClick(1)
            : props.onClick(false);
        }}
      >
        <New />
        NUEVO
      </AbmLink>

      <SubMenuNew className={props.index === 1 ? 'open' : 'closed'}>
        <RoleBasedACL roles={['project:create']}>
          <Link to="/projects/add" onClick={() => props.onClick(false)}>
            + <I18n t="header.projects" />
          </Link>
        </RoleBasedACL>
        <RoleBasedACL roles={['user:create']}>
          <Link to="/users/add" onClick={() => props.onClick(false)}>
            + <I18n t="header.user" />
          </Link>
        </RoleBasedACL>
        <RoleBasedACL roles={['process:create']}>
          <Link to="/processes/add" onClick={() => props.onClick(false)}>
            + PROCESO
          </Link>
        </RoleBasedACL>
      </SubMenuNew>
    </div>
  );
}
