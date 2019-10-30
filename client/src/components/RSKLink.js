import React from 'react';

function RSKLink({ hash, type, testnet, text }) {
  return (
    <a
      href={`https://explorer${testnet === true &&
        '.testnet'}.rsk.co/${type}/${hash}`}
    >
      {text}
    </a>
  );
}
export default RSKLink;
