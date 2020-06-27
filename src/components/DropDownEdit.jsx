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
  NavLogin,
} from '../styles/Nav';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link, NavLink } from 'react-router-i18n';
import I18n from '../i18n';

export default function DropDownEdit(props: any) {
  return (
    <div>
      <AbmLink
        onClick={() => {
          props.index === false ? props.onClick(2) : props.onClick(false);
        }}
      >
        <Eye />
        VER / EDITAR
      </AbmLink>

      <SubMenuEdit className={props.index === 2 ? 'open' : 'closed'}>
        <Link to="/projects" onClick={() => props.onClick(false)}>
          + PROYECTO
        </Link>
        <Link to="/users" onClick={() => props.onClick(false)}>
          + USUARIO
        </Link>

        <Link to="/processes" onClick={() => props.onClick(false)}>
          + PROCESO
        </Link>
      </SubMenuEdit>
    </div>
  );
}
