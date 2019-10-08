const { SwarmClient } = require('@erebos/swarm-node');

module.exports.swarmClient = new SwarmClient({
  bzz: { url: 'https://swarm-gateways.net/' }
});
