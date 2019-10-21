import React from 'react';
import certificado from './cert.pdf';

function DocumentDetail() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'right' }}>
        <iframe src={certificado} width="50%" height="700"></iframe>
        <div style={{ marginLeft: '50px' }}>
          <h1>Document Detail</h1>

          <div>
            <b>Name:</b> Certificado de barra
          </div>
          <div>
            <b>Supplier:</b> BGH.rsk
          </div>
          <div>
            <b>Hash:</b> 0x9afba1fB824a7e523D666665D4fA8D59FFDDdd87
          </div>
          <div style={{ marginTop: '40px' }}>
            <b>Proceso de certificación</b>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <div>Documento subido</div>
              <div>Transferencia emitida</div>
              <div>Guardado en Blockchain</div>
            </div>
          </div>
          <div style={{ marginTop: '40px' }}>
            <b>Notas</b>
            <div>
              <div>
                Se encontró una fe de erratas en la composición química...
              </div>
              <div>11/09/2019 BGH</div>
            </div>
            <div>
              <div>No cumple con norma</div>
              <div>11/09/2019 NA-SA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetail;
