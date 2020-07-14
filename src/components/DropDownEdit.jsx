import React from 'react';
import { AbmLink, SubMenuEdit } from '../styles/Nav';
import { ReactComponent as Eye } from '../img/eye.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DropDownEdit(props) {
  const { t } = useTranslation();
  return (
    <div>
      <AbmLink
        onClick={() => {
          props.index === false ? props.onClick(2) : props.onClick(false);
        }}
      >
        <Eye />
        {t('forms:view')} / {t('forms:edit')}
      </AbmLink>

      <SubMenuEdit className={props.index === 2 ? 'open' : 'closed'}>
        {(props.user.type === '0' || props.user.type === '1') && (
          <Link to="/projects" onClick={() => props.onClick(false)}>
            + {t('header:projects')}
          </Link>
        )}
        {props.user.type === '0' && (
          <Link to="/users" onClick={() => props.onClick(false)}>
            + {t('header:user')}
          </Link>
        )}
        {(props.user.type === '0' || props.user.type === '2') && (
          <Link to="/processes" onClick={() => props.onClick(false)}>
            + {t('header:proceso')}
          </Link>
        )}
      </SubMenuEdit>
    </div>
  );
}
