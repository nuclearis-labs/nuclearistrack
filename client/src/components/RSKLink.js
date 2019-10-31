import React from 'react';
import Hash from './Hash';

function RSKLink({ hash, type, testnet, text }) {
  return (
    <a
      href={`https://explorer${testnet === true &&
        '.testnet'}.rsk.co/${type}/${hash}`}
    >
      <Hash hash={text} lengthBothSides={6} />
    </a>
  );
}
export default RSKLink;
