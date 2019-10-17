import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

function CallContract() {
  const [form, setForm] = useState([]);
  const [data, setData] = useState([]);
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
  );

  async function call() {
    setData([]);
    const { data } = await axios.post('/api/user/getAll', form);
    const result = await data.result.map(async m => {
      let array = await axios.post('/api/user/get/' + m, form);
      let details = await array.data.result[1].map(async x => {
        let detailsArray = await axios.post('/api/project/get/' + x, form);
        return detailsArray;
      });
      details = await Promise.all(details);
      return [m, array.data.result[0], details[0].data];
    });
    Promise.all(result).then(res => {
      console.log(res);
      setData(res);
    });
  }

  function handleInput(e) {
    e.persist();
    setForm(form => ({ ...form, [e.target.name]: e.target.value }));
  }

  return (
    <div>
      <div>
        <input type="email" name="email" onChange={handleInput} />
      </div>
      <div>
        <input type="password" name="passphrase" onChange={handleInput} />
      </div>
      <div>
        <button onClick={call}>Call Contract</button>
      </div>
      {data && data.length !== 0 && (
        <div>
          {data.map((m, i) => (
            <div key={i}>
              <span>{m[0]}</span>
              <span className="ml-5">{web3.utils.toAscii(m[1])}</span>
              <span className="ml-5">
                {m[2].map((x, i) => {
                  return (
                    <>
                      <span key={i}>{web3.utils.toAscii(x[3])}</span>
                      <br />
                    </>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CallContract;
