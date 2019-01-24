module.exports = {

  // See <http://truffleframework.com/docs/advanced/configuration>
  
  // to customize your Truffle configuration!
  
  networks: {
  aleRSK: {
  gas : 2500000,
  gasPrice : 1,
  from : "0x5612e3e6330534f87a3c639a266ff2226ac2b78e",
  host: "https://public-node.testnet.rsk.co/", //your node url, or the public node url
  port: 4444,
  network_id: "*" // Match any network id
  }
  }
  };