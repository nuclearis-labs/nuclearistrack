import React from 'react';
import { AbmLink, SubMenuNew } from '../styles/Nav';
import { Link } from 'react-router-i18n';
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
        <Link to="/projects/add" onClick={() => props.onClick(false)}>
          + <I18n t="header.projects" />
        </Link>
        <Link to="/users/add" onClick={() => props.onClick(false)}>
          + <I18n t="header.user" />
        </Link>
        <Link to="/processes/add" onClick={() => props.onClick(false)}>
          + PROCESO
        </Link>
      </SubMenuNew>
    </div>
  );
}
