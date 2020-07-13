async function getProjectList() {
  const projects = await contract.methods
    .getProjectsByAddress()
    .call({ from: account.address });
  Promise.all(
    projects.map((project) =>
      contract.methods
        .getProjectDetails(project)
        .call({ from: account.address })
    )
  ).then((projects) => {
    // TODO: Extract getUserName Logic
    Promise.all(
      projects.map(async (project) => {
        return {
          ...project,
          '2': await contract.methods
            .getUser(project[2])
            .call({ from: account.address }),
        };
      })
    ).then((projects) => setProjects(projects));
  });
}

async function getUserList() {
  const addresses = await contract.methods
    .getAllUsers()
    .call({ from: account.address });
  Promise.all(
    addresses.map((address) =>
      contract.methods.getUser(address).call({ from: account.address })
    )
  ).then((users) => {
    Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          '4': parseFloat(
            web3.utils.fromWei(await web3.eth.getBalance(user[3]))
          ).toFixed(6),
        };
      })
    ).then((users) => setUsers(users));
  });
}
