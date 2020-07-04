import React, { useState, useEffect } from 'react';
import { useInterval } from 'react-use';
import useWeb3 from '../hooks/useWeb3';
import RSKLink from '../components/RSKLink';
import { Label, Button } from '../styles/components';
import { Link } from 'react-router-dom';

export default function TxTrack(props) {
  const [receipt, setReceipt] = useState();
  const [web3] = useWeb3();

  useEffect(() => {
    setReceipt();
  }, [props.tx]);

  useInterval(
    () => {
      web3.eth.getTransactionReceipt(props.tx).then((result) => {
        console.log(result);

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
          : receipt.status === 'true'
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
            {receipt.status === 'true'
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
