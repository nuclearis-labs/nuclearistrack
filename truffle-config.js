module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    networks: {
      development: {
         host: "localhost",
         port: 8545,
         network_id: "*"
      },
      rsk: {
         host: "localhost",
         port: 4444,
         network_id: "31",
      }
    }
};
