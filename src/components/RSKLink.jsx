import React from 'react';

function hashFunction(hash, lengthBothSides = 6) {
  const start = hash.substr(0, lengthBothSides);
  const end = hash.substr(-lengthBothSides);
  return `${start}...${end}`;
}

export default function RSKLink({ hash, type, testnet }) {
  return (
    <a
      href={`https://explorer${
        testnet === true ? '.testnet' : ''
      }.rsk.co/${type}/${hash}`}
    >
      {hashFunction(hash, 6)}
    </a>
  );
}
