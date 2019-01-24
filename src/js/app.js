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
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


  initContract: function() {
    $.getJSON("MO.json", function(data) {
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

      date = new Date(timestamp * 1000),
      datevalues = [
      date.getFullYear(),
      date.getMonth()+1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
];
      var dateformat = datevalues[2] + "/" + datevalues[1] + "/" + datevalues[0] + " " + datevalues[3] + ":" + datevalues[4] + ":" + datevalues[5]; 
      var doc = "<tr><th>" + id + "</th><td>" + dateformat + "</td><td>" + doc_hash + "</td><td><a href='http://ec2-18-216-156-252.us-east-2.compute.amazonaws.com:8080/ipfs/" + ipfs_hash + "' target='_blank'>IPFS File</a></td><td>"+owner+"</td></tr>";
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

    if (doc_hash == documento[2] && exit !== 1) {
      $("#hashresult").html("Hash found: <br>" + doc_hash);
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
        var ipfshash = "Qmdm4j3NRrbNe66mHnyKzJPrhAo4mdTK1KkHutmUajMi5v";
        App.contracts.MO.deployed().then(function(instance) { 
          MOInstance = instance; 
          
          MOInstance.addHash(date/1000,doc_hash,ipfshash);
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
