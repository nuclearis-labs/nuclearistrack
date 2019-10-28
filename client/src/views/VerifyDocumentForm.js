import React, { Component } from 'react';
import FileSelector from '../components/FileSelector';
import axios from 'axios';

class VerifyDocumentForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      file: '',
      projects: {},
      modal: false
    };
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  }
  handleFileChange(e) {
    this.setState({ file: e });
  }

  toggleModal() {
    this.setState(state => ({ modal: !state.modal }));
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();

    formData.append('file', this.state.file);

    axios
      .post(`/api/doc/verify/${this.state.contract}`, formData, {
        'Content-Type': 'multipart/form-data'
      })
      .then(({ data }) => {
        console.log(this.props.history.location);
        console.log(data);

        if (data === false) this.setState({ notFound: true });
        else
          this.props.history.push(
            '/document-detail/' + this.state.contract + '/' + data
          );
        this.toggleModal();
      });
  }

  componentDidMount() {
    axios
      .post('/api/user/get/0x42F9F3fA9B3fAd8C6AeBB795e6Cd2DDf2CdFf990')
      .then(({ data }) => this.setState({ projects: data.proyectos }));
  }

  render() {
    return (
      <div className="container">
        <h1>Verify Document</h1>
        {this.state.modal ? (
          <div className="text-center">
            <h3>Archivo no encontrado</h3>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="project">Project</label>
              <select
                className="form-control"
                onChange={this.handleInputChange}
                name="contract"
              >
                <option>Choose one...</option>
                {this.state.projects.length > 0 &&
                  this.state.projects.map(project => (
                    <option key={project[1]} value={project[3]}>
                      {project[1] + ' / ' + project[0]}
                    </option>
                  ))}
              </select>
            </div>
            <FileSelector onFileChange={this.handleFileChange} />

            <button onClick={this.handleSubmit} className="btn btn-primary">
              Upload
            </button>
          </>
        )}
      </div>
    );
  }
}

export default VerifyDocumentForm;
