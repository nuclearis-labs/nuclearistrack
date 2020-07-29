import React from 'react';
import { AbmLink, SubMenuNew } from '../styles/Nav';
import { ReactComponent as New } from '../img/new.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DropDownNew(props) {
  const { t } = useTranslation();

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
        {t('dropDownNew:title')}
      </AbmLink>

      <SubMenuNew className={props.index === 1 ? 'open' : 'closed'}>
        <Link to="/projects/add" onClick={() => props.onClick(false)}>
          + {t('dropDownNew:projects')}
        </Link>
        <Link to="/users/add" onClick={() => props.onClick(false)}>
          + {t('dropDownNew:users')}
        </Link>
        <Link to="/processes/add" onClick={() => props.onClick(false)}>
          + {t('dropDownNew:processes')}
        </Link>
      </SubMenuNew>
    </div>
  );
}
