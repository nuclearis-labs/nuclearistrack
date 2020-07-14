import React, { useState, useEffect, useContext } from 'react';
import { useInterval } from 'react-use';
import RSKLink from './RSKLink';
import { Label } from '../styles/components';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

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

  return (
    <>
      <Label>
        {receipt === undefined
          ? t('txTracker:pendiente')
          : receipt.status === true
          ? t('txTracker:success')
          : t('txTracker:error')}
      </Label>
      <div>
        {t('txTracker:hash')}: <RSKLink hash={props.tx} testnet type="tx" />
      </div>
      {receipt ? (
        <>
          <div>
            {t('txTracker:block')}:{' '}
            <RSKLink hash={receipt.blockHash} testnet type="block" />
          </div>
          <div>
            {t('txTracker.state')}:{' '}
            {receipt.status === true
              ? t('txTracker:success')
              : t('txTracker:receiptError')}
          </div>
        </>
      ) : (
        t('txTracker:waiting')
      )}
    </>
  );
}
