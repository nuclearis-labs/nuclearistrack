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
    
      //App.listenForEvents();

      // Use our contract to retrieve and mark the adopted pets
      return App.render();
    });

  },

  render: function() {

    var docRow = $('#docRow');

    var MOInstance;

    App.contracts.MO.deployed().then(function(instance) {
      MOInstance = instance;

      return MOInstance.Cantdoc();
    }).then(function(cantidadesDoc) {

    for (var i=1;i<=cantidadesDoc;i++) {
      MOInstance.documentos(i).then(function(documento) {
      var id = documento[0];
      var timestamp = documento[1]
      var doc_hash = documento[2];
      var ipfs_hash = documento[3];
      var owner = documento[4];

      var doc = "<tr><th>" + id + "</th><td>" + timestamp + "</td><td>" + doc_hash + "</td><td>" + ipfs_hash + "</td><td>"+owner+"</td></tr>";
      docRow.append(doc);

      })
    }

    })
  },

  /*listenForEvents: function() {
    App.contracts.MO.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  }
*/
};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
