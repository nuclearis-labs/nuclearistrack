import { useState, useEffect, useRef } from 'react';
import useWeb3 from '../hooks/useWeb3';

export default function useAuth() {
  const [web3, contract] = useWeb3();

  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(false);
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function checkUser() {
      const msgSender = await web3.eth.getCoinbase();
      try {
        const user = await contract.methods
          .getUser(msgSender)
          .call({ from: msgSender });
        if (user[0] === '1') {
          setIsUser(true);
          setUser({
            status: user[0],
            type: user[1],
            name: user[2],
            address: user[3],
          });
        } else {
          setIsUser(false);
          setUser({});
        }
      } catch (error) {
        setIsUser(false);
        setUser({});
      }
    }
    if (web3 && contract) checkUser();
  }, [web3, contract]);
  return [isUser, user];
}
