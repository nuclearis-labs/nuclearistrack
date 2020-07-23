import Web3 from 'web3';
import { useEffect, useReducer } from 'react';
import NuclearPoE from '../build/contracts/NuclearPoE.json';

export default function useWeb3(props) {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    isReady: false,
    isConnected: false,
    account: null,
    contract: null,
    web3: undefined,
  });

  useEffect(() => {
    if (!window.ethereum) dispatch({ type: 'noWeb3Provider' });
    else dispatch({ type: 'ready' });
  }, []);

  useEffect(() => {
    if (state.isReady)
      window.ethereum.on('accountsChanged', (account) => {
        if (account.length > 0) {
          state.contract.methods
            .getUser(account[0])
            .call({ from: account[0] })
            .then((user) => {
              if (user[0] === '1') {
                dispatch({
                  type: 'connect',
                  user: {
                    status: user[0],
                    type: user[1],
                    name: user[2],
                    address: user[3],
                  },
                });
              } else {
                dispatch({ type: 'disconnect' });
              }
            })
            .catch((error) => {
              dispatch({ type: 'disconnect' });
            });
        } else dispatch({ type: 'ready' });
      });
    // eslint-disable-next-line
  }, [state.isReady, state.web3]);

  function reducer(state, action) {
    switch (action.type) {
      case 'ready':
        const web3 = new Web3(window.ethereum);
        return {
          isLoading: true,
          isReady: true,
          isConnected: false,
          account: null,
          contract: new web3.eth.Contract(
            NuclearPoE.abi,
            process.env.REACT_APP_CONTRACT
          ),
          web3,
        };
      case 'connect':
        return {
          isLoading: false,
          isReady: true,
          isConnected: true,
          account: action.user,
          contract: state.contract,
          web3: state.web3,
        };
      case 'disconnect':
        return {
          isLoading: false,
          isReady: true,
          isConnected: false,
          account: null,
          contract: state.contract,
          web3: state.web3,
        };
      case 'noWeb3Provider':
        return {
          isLoading: false,
          isReady: false,
          isConnected: false,
          account: null,
          contract: undefined,
          web3: undefined,
        };
      default:
        throw new Error();
    }
  }

  function connect() {
    if (state.isReady) {
      state.web3.eth.getCoinbase().then((msgSender) => {
        if (msgSender === null) window.ethereum.enable();
        else {
          state.contract.methods
            .getUser(msgSender)
            .call({ from: msgSender })
            .then((user) => {
              if (user[0] === '1') {
                dispatch({
                  type: 'connect',
                  user: {
                    status: user[0],
                    type: user[1],
                    name: user[2],
                    address: user[3],
                  },
                });
              } else {
                dispatch({ type: 'disconnect' });
              }
            })
            .catch((error) => {
              dispatch({ type: 'disconnect' });
            });
        }
      });
    }
  }

  return {
    isLoading: state.isLoading,
    isReady: state.isReady,
    isConnected: state.isConnected,
    account: state.account,
    web3: state.web3,
    contract: state.contract,
    connect,
  };
}
