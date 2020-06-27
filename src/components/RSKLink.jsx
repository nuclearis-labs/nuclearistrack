import React from 'react';

interface IRSKLink {
  hash: string;
  type: string;
  testnet: boolean;
}

function hashFunction(hash: string, lengthBothSides: number = 6) {
  const start = hash.substr(0, lengthBothSides);
  const end = hash.substr(-lengthBothSides);
  return `${start}...${end}`;
}

export default function RSKLink({ hash, type, testnet }: IRSKLink) {
  return (
    <a
      href={`https://explorer${testnet === true &&
        '.testnet'}.rsk.co/${type}/${hash}`}
    >
      {hashFunction(hash, 6)}
    </a>
  );
}
