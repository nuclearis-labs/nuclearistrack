import React, { useState, useEffect, useContext } from 'react';
import { useInterval } from 'react-use';
import RSKLink from './RSKLink';
import { Label } from '../styles/components';
import { UserContext } from '../context/UserContext';

export default function TxTrack(props) {
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
          ? 'TRANSACCION PENDIENTE'
          : receipt.status === true
          ? 'EXITO'
          : 'HUBO UN ERROR'}
      </Label>
      <div>
        Transaction Hash: <RSKLink hash={props.tx} testnet type="tx" />
      </div>
      {receipt ? (
        <>
          <div>
            Bloque: <RSKLink hash={receipt.blockHash} testnet type="block" />
          </div>
          <div>
            Estado:{' '}
            {receipt.status === true
              ? 'EXITOSO'
              : 'FALLIDO, POR FAVOR REPITA Y CHEQUEE LOS DATOS INGRESADOS'}
          </div>
        </>
      ) : (
        'Esperando confirmacion de la transacción... No se requiere esperar la confirmación.'
      )}
    </>
  );
}
