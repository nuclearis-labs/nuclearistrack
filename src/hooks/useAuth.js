import { useState, useEffect, useRef, useContext } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';

export default function useAuth() {
  const { drizzle, initialized } = useContext(DrizzleContext.Context);
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(false);
  const state = drizzle.store.getState();
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialized && _isMounted.current) {
      drizzle.contracts.NuclearPoE.methods
        .getUser(state.accounts[0])
        .call({ from: state.accounts[0] })
        .then((result) => {
          if (result[0] == '1') {
            setIsUser(true);
            setUser({
              status: result[0],
              type: result[1],
              name: drizzle.web3.utils.hexToAscii(result[2]),
              address: state.accounts[0],
            });
          } else {
            setIsUser(false);
            setUser({});
          }
        })
        .catch((error) => {
          setIsUser(false);
          setUser({});
        });
    }
  }, [state]);
  return [isUser, user];
}
