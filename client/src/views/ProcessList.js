import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import CogIcon from '../components/CogIcon';
import CheckIcon from '../components/CheckIcon';
import RSKLink from '../components/RSKLink';
import Hash from '../components/Hash';

function ProcessListTableBody({ processes }) {
  if (processes.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          No processes available
        </td>
      </tr>
    );
  }
  return (
    <>
      {processes &&
        processes.map(
          (
            {
              processName,
              supplierAddress,
              supplierName,
              allDocuments,
              contractAddress,
              status
            },
            i
          ) => {
            return (
              <tr key={i}>
                <td>
                  {status === 'pending' ? (
                    <>{processName}</>
                  ) : (
                    <Link to={'/project-detail/'}>{processName}</Link>
                  )}
                </td>
                <td>
                  <Link to={'/client-detail/' + supplierAddress}>
                    {supplierName}
                  </Link>
                </td>
                <td>
                  {allDocuments.map(document => (
                    <div>
                      <Hash hash={document} />
                    </div>
                  ))}
                </td>
                <td>
                  <RSKLink
                    hash={contractAddress}
                    type="address"
                    testnet={true}
                    text={contractAddress}
                  />
                </td>
                <td>{status === 'pending' ? <CogIcon /> : <CheckIcon />}</td>
              </tr>
            );
          }
        )}
    </>
  );
}

function ProcessList() {
  const [processes, setProcesses] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios({
      method: 'get',
      url: '/api/process/get',
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
      .then(({ data }) => {
        console.log(data);

        setProcesses(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <div className="container">
      <h1>Process List</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <Table
          body={<ProcessListTableBody processes={processes} />}
          columns={['Name', 'Supplier', 'Documents', 'Contract', 'Status']}
        ></Table>
      )}
    </div>
  );
}

export default ProcessList;
