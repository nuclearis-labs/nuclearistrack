App = {
  web3Provider: null,
  contracts: {},
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
  if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('MO.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MOArtifact = data;
      App.contracts.MO = TruffleContract(MOArtifact);
    
      // Set the provider for our contract
      App.contracts.MO.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.render();
    });

  },

  render: function() {

    var docRow = $('#docRow');
    var docTemplate = $('#docTemplate');

    var MOInstance;

    App.contracts.MO.deployed().then(function(instance) {
      MOInstance = instance;

      return MOInstance.listipfsHash(1);
    }).then(function(ipfs_hash) {
      docTemplate.find('.ipfs_hash').text(ipfs_hash);
      docRow.append(docTemplate.html());
      return MOInstance.listowner(1);
    }).then(function(owner) {
      docTemplate.find('.owner').text(owner);
      docRow.append(docTemplate.html());
    })
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
