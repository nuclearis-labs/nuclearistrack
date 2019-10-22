import React, { Component } from 'react';
import axios from 'axios';

class DocumentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { doc: '' };
  }
  componentDidMount() {
    console.log(this.props.match.params);

    axios
      .post(
        `/api/doc/download/${this.props.match.params.contract}/${this.props.match.params.hash}`
      )
      .then(result => {
        console.log(result);

        this.setState({ doc: result.data });
      });
  }

  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'right' }}>
          <iframe
            src={`data:application/pdf;base64,${this.state.doc.buffer}`}
            width="50%"
            height="700"
          ></iframe>
          <div style={{ marginLeft: '50px' }}>
            <h1>Document Detail</h1>

            <div>
              <b>Name:</b> {this.state.doc.name}
            </div>

            <div>
              <b>Hash:</b> {this.state.doc.hash}
            </div>
            <div>
              <b>Mine Time:</b> {Date(this.state.doc.mineTime)}
            </div>
            <div>
              <b>StorageHash:</b> {this.state.doc.storageHash}
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
}

export default DocumentDetail;
