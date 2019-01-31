$(document).ready(function() {
  mo_init();
});

function hashForFile(callback) {
  input = document.getElementById("hashFile");
  if (!input.files[0]) {
    $("#responseText").html('<div class="alert alert-warning" role="alert"><b>Se debe seleccionar primero un archivo!</b></div>');
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = function (e) {
      content = e.target.result;
      var shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
      shaObj.update(content);
      var hash = "0x" + shaObj.getHash("HEX");
      callback(null, hash);
    };
    fr.readAsArrayBuffer(file);
  }
};

function send () {
  document.getElementById('loader').style="display: block";
  document.getElementById('hashFile').setAttribute("disabled", "");
  document.getElementById('sendHashButton').setAttribute("disabled", "");
  document.getElementById('findHashButton').setAttribute("disabled", "");
  hashForFile(function (err, hash) {
    MO_find(hash, function(err, resultObj) {
      if (resultObj.blockNumber != 0) {
        document.getElementById('hashFile').removeAttribute("disabled", "");
        document.getElementById('sendHashButton').removeAttribute("disabled", "");
        document.getElementById('findHashButton').removeAttribute("disabled", "");
        document.getElementById('loader').style="display: none";
        $("#responseText").html("<div class='alert alert-warning' role='alert'><p><b>Hash de archivo ya fue guardado en la Blockchain.</b></p>"
          + "<p><b>Hash del archivo: </b><br/>" + hash + "</p>"
          + "<p><b>Nº de bloque minado: </b><br/>" + resultObj.blockNumber + "</p>"
          + "<p><b>Fecha y hora de bloque minado: </b><br/>" + resultObj.mineTime + "</p></div>"
        );
      } else {
        
        MO_send(hash, function(err, receipt) {
          document.getElementById('loader').style="display: none";
          document.getElementById('hashFile').removeAttribute("disabled", "");
          document.getElementById('sendHashButton').removeAttribute("disabled", "");
          document.getElementById('findHashButton').removeAttribute("disabled", "");
              let url = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
              fetch(url)
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                  let eth1 = JSON.stringify(data[0]);
                  let eth2 = JSON.parse(eth1);
                  $("#responseText").html("<div class='alert alert-info' role='alert'><p><b>Hash de archivo fue guardado en la Blockchain.</b></p>"
                  + "<p><b>Hash del archivo:</b><br/> " + hash +"</p>"
                  + "<p><b>Identificación de transacción:</b><br/> " + receipt.transactionHash + "</p>"
                  + "<p><b>Costo de la transacción:</b><br/>" + (receipt.gasUsed*20000000000)/10**18 + " ETH / " + Math.round(((receipt.gasUsed*20000000000)/10**18 * eth2.price_usd)*100)/100 + " USD</p>"
                  + "<p><b>Dirección del contrato:</b><br/> " + receipt.to +"</p>"
                  + "<p><b>Numero de bloque minado:</b><br/> " + receipt.blockNumber + "</p>"
                  //+ "<p><b>Por favor permita un rato para que sea minada la transacción.</b></p></div>"
                );
              });
        });
      }
    });
  });
};

function find () {
  hashForFile(function (err, hash) {
    MO_find(hash, function(err, resultObj) {
      if (resultObj.blockNumber != 0) {
        $("#responseText").html("<div class='alert alert-success' role='alert'><p><b>Hash de archivo encontrado en la Blockchain.</b></p>"
          + "<p><b>Hash del archivo: </b><br/>" + hash + "</p>"
          + "<p><b>Nº de bloque minado: </b><br/>" + resultObj.blockNumber + "</p>"
          + "<p><b>Fecha y hora de bloque minado: </b><br/>" + resultObj.mineTime + "</p></div>"
        );
      } else {
        $("#responseText").html("<div class='alert alert-warning' role='alert'><p><b>Hash de archivo no encontrado en la Blockchain.</b></p>"
          + "<p><b>Hash del archivo: </b><br/>" + hash + "</p></div>"
        );
      }
    });
  });
};
