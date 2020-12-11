import Process from '../artifacts//contracts/Process.sol/Process.json';

export const getBalance = async (web3, address) =>
  parseFloat(web3.utils.fromWei(await web3.eth.getBalance(address))).toFixed(6);

export const getAllUsers = async (contract, from) => {
  return await contract.methods.getAllUsers().call({ from });
};

export const getUserBalances = (web3) => async (users) => {
  return await Promise.all(
    users.map(async (user) => {
      return {
        ...user,
        '4': await getBalance(web3, user[3]),
      };
    })
  );
};

export const getProcessDetails = (from, web3) => async (addresses) => {
  return await Promise.all(
    addresses.map((address) => {
      const processContract = new web3.eth.Contract(Process.abi, address);
      return processContract.methods.getDetails().call({ from });
    })
  );
};

export const getDocumentDetails = (from, contract) => async ([documents]) => {
  console.log(documents);
  return await Promise.all(
    documents[2].map((document) => {
      return contract.methods.getDocument(document).call({ from });
    })
  );
};

export const getProjectDetails = (from, contract, web3) => async (
  projectIds
) => {
  return await Promise.all(
    projectIds.map((project) =>
      contract.methods.getProjectDetails(project).call({ from })
    )
  );
};

export const getUserDetails = (from, contract, userIndex, web3) => async (
  promiseArray
) => {
  return await Promise.all(
    promiseArray.map(async (item) => {
      if (item instanceof Object)
        return {
          ...item,
          [userIndex]: await contract.methods
            .getUser(item[userIndex])
            .call({ from }),
        };
      else if (typeof item === 'string') {
        return { ...(await contract.methods.getUser(item).call({ from })) };
      } else {
        throw Error('Has to be object or array');
      }
    })
  );
};

export const getProcessesByAddress = async (contract, from) => {
  return await contract.methods.getProcessesByAddress().call({ from });
};

export const getProjectsByAddress = async (contract, from) => {
  return await contract.methods.getProjectsByAddress().call({ from });
};

export const filter = (f) => (input) => input.filter(f);

export const createProject = (contract, data, web3, from) => {
  return contract.methods
    .createProject(data.expediente, data.proyectoTitle, data.oc)
    .send({ from });
};
