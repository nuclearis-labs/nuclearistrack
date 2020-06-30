import React from 'react';
import Web3 from 'web3';
import NuclearPoE from '../build/contracts/NuclearPoE.json';

const get = (httpProvider) => {
  return new Promise((resolve, reject) => {
    if (httpProvider) {
      const provider = new Web3.providers.HttpProvider(httpProvider);
      const web3 = new Web3(provider);
      resolve(web3);
      return;
    }

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(web3);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (window.web3) {
      resolve(window.web3);
    } else {
      resolve(null);
    }
  });
};

export default function useWeb3(httpProvider) {
  const [web3, setWeb3] = React.useState([]);

  React.useEffect(() => {
    const getWeb3 = async () => {
      const web3 = await get(httpProvider);
      if (web3 !== null) {
        const contract = new web3.eth.Contract(
          NuclearPoE.abi,
          '0x5A08f0299683a1c96675f01B9778e9886f21Bd9d'
        );

        return [web3, contract];
      }
      return [null, null];
    };

    getWeb3().then((info) => {
      setWeb3(info);
    });
  }, [httpProvider]);

  return [...web3];
}
