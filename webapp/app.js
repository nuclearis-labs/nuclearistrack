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
  hashForFile(function (err, hash) {
    MO_find(hash, function(err, resultObj) {
      if (resultObj.blockNumber != 0) {
        $("#responseText").html("<div class='alert alert-warning' role='alert'><p><b>Hash de archivo ya fue guardado en la Blockchain.</b></p>"
          + "<p><b>Hash del archivo: </b><br/>" + hash + "</p>"
          + "<p><b>Nº de bloque minado: </b><br/>" + resultObj.blockNumber + "</p>"
          + "<p><b>Fecha y hora de bloque minado: </b><br/>" + resultObj.mineTime + "</p></div>"
        );
        console.log("Ya fue guardado");
      } else {
        MO_send(hash, function(err, tx) {
          $("#responseText").html("<div class='alert alert-info' role='alert'><p><b>Hash de archivo fue guardado en la Blockchain.</b></p>"
            + "<p><b>Hash del archivo:</b><br/> " + hash +"</p>"
            + "<p><b>Identificación de transacción:</b><br/> " + tx +"</p>"
            + "<p><b>Dirección del contrato:</b><br/> " + address +"</p>"
            //+ "<p><b>Por favor permita un rato para que sea minada la transacción.</b></p></div>"
          );
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
