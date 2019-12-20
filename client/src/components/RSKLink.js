import React from 'react';
import Hash from './Hash';

function RSKLink({ hash, type, testnet }) {
  return (
    <a
      href={`https://explorer${testnet === true &&
        '.testnet'}.rsk.co/${type}/${hash}`}
    >
      <Hash hash={hash} lengthBothSides={6} />
    </a>
  );
}
export default RSKLink;
