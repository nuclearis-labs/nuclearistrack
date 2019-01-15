//Definición de objeto App, donde se genera el front-end
App = {
  //Definición inicial de contrato y web3provider
  web3Provider: null,
  contracts: {},

  //Función de inicio de JS que inicia el web3
  init: function() {
    return App.initWeb3();
  },
  
  //Inicio de web3
  initWeb3: async function() {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');

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

};

function getHash (evt) {

  // Check for the various File API support.
  /*if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("Great success! All the File APIs are supported.");
  } else {
    console.log("The File APIs are not fully supported in this browser.");
  }*/
    var files = evt.target.files;
    doc_hash = null;
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
          var sha256 = CryptoJS.SHA256(e.target.result);
          doc_hash = sha256.toString();
        }
    })(f);

    reader.readAsBinaryString(f);
  }
    App.contracts.MO.deployed().then(function(instance) { 
      MOInstance = instance;
  
      return MOInstance.Cantdoc();
    }).then(function(cantidadesDoc) {

    for (var i=1;i<=cantidadesDoc;i++) {
      MOInstance.documentos(i).then(function(documento) {

    if (doc_hash == documento[2] && exit != 1) {
      $("#hashresult").html("Hash found: " + doc_hash);
      var exit = '1';
    } else {
      $("#hashresult").html("Hash not found");
    }
    })
  }
    }).catch(function(err) {
      console.error(err);
    });

}

function addHash(evt) {

  var files = evt.target.files;
  doc_hash = null;
  console.log(doc_hash);

  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();

  reader.onload = (function(theFile) {
      return function(e) {
        var sha256 = CryptoJS.SHA256(e.target.result);
        doc_hash = sha256.toString();
        var date = Date.now()
        App.contracts.MO.deployed().then(function(instance) { 
          MOInstance = instance; 
          
          MOInstance.addHash(date,doc_hash,"ipfsHash4");
        })
      }
  })(f);

  reader.readAsBinaryString(f);
}

doc_hash = '';
}

//Función que se ejecuta al cargar la ventana, manda a función init en primeras filas
$(function() {
  $(window).load(function() {
    App.init();
  });
});
