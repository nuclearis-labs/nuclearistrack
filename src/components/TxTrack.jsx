import React, { useState, useEffect, useContext } from 'react';
import { useInterval } from 'react-use';
import RSKLink from './RSKLink';
import { Label } from '../styles/components';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Loader } from '../img/puff.svg';
import { ReactComponent as Checkmark } from '../img/checkmark.svg';
import { ReactComponent as Cross } from '../img/cross.svg';

export default function TxTrack(props) {
  const { t } = useTranslation();
  const [receipt, setReceipt] = useState();
  const { web3 } = useContext(UserContext);

  useEffect(() => {
    setReceipt();
  }, [props.tx]);

  useInterval(
    () => {
      web3.eth.getTransactionReceipt(props.tx).then((result) => {
        if (result !== null) setReceipt(result);
      });
    },
    receipt ? null : 2000
  );

  function State({ receipt }) {
    if (receipt && receipt.status === true)
      return <Checkmark style={{ margin: '20px 0' }} />;
    else if (receipt && receipt.status === false)
      return <Cross style={{ margin: '20px 0' }} />;
    else return <Loader style={{ margin: '20px 0' }} />;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Label>
          {receipt === undefined
            ? t('txTracker:pendiente')
            : receipt.status === true
            ? t('txTracker:success')
            : t('txTracker:error')}
        </Label>{' '}
        <State receipt={receipt} />
        <div>
          {t('txTracker:hash')}: <RSKLink hash={props.tx} testnet type="tx" />
        </div>
        {receipt && (
          <div>
            {t('txTracker:block')}:{' '}
            <RSKLink hash={receipt.blockHash} testnet type="block" />
          </div>
        )}
      </div>
    </>
  );
}
