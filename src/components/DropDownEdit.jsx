import React from 'react';
import { AbmLink, SubMenuEdit } from '../styles/Nav';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';

export default function DropDownEdit(props) {
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
        {(props.user.type === '0' || props.user.type === '1') && (
          <Link to="/projects" onClick={() => props.onClick(false)}>
            + PROYECTO
          </Link>
        )}
        {props.user.type === '0' && (
          <Link to="/users" onClick={() => props.onClick(false)}>
            + USUARIO
          </Link>
        )}
        {(props.user.type === '0' || props.user.type === '2') && (
          <Link to="/processes" onClick={() => props.onClick(false)}>
            + PROCESO
          </Link>
        )}
      </SubMenuEdit>
    </div>
  );
}
