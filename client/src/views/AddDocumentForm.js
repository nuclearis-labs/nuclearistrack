import React, { Component } from 'react';
import FileSelector from '../components/FileSelector';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import ConfirmTx from '../components/ConfirmTx';

class AddDocumentForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      documentTitle: '',
      file: '',
      location: {},
      projects: {}
    };
  }

  handleFileChange(e) {
    this.setState({ file: e });
  }
  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  }

  componentDidMount() {
    axios
      .post(`/api/user/get/${this.context.contextUser.userEmail}`)
      .then(({ data }) => this.setState({ projects: data.proyectos }))
      .catch(e => console.log(e));
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      this.setState({
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();

    formData.append('file', this.state.file);
    formData.append('documentTitle', this.state.documentTitle);
    formData.append('latitude', this.state.latitude);
    formData.append('longitude', this.state.longitude);
    formData.append('email', this.context.contextUser.userEmail);
    formData.append('passphrase', this.state.passphrase);
    axios
      .post(`/api/doc/upload/${this.state.contract}`, formData, {
        'Content-Type': 'multipart/form-data'
      })
      .then(result => console.log(result));
  }

  render() {
    return (
      <div className="container">
        <h1>Add Document {}</h1>
        <form>
          <div className="form-group">
            <label htmlFor="name">Doc Number</label>
            <input
              className="form-control"
              onChange={this.handleInputChange}
              type="text"
              name="documentTitle"
              readOnly
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <br />

            {/*     <iframe
              width="600"
              height="450"
              style={{ border: '0' }}
              src={
                'https://www.google.com/maps/embed/v1/place?key=AIzaSyCHpdtM1Pvk-nSgdFB02zUeq7TnTy_eGPs&q=' +
                this.state.latitude +
                ',' +
                this.state.longitude
              }
              allowFullScreen
            ></iframe> */}
          </div>
          <hr />
          <ConfirmTx
            contextUser={this.context.contextUser}
            type="Document"
            handleSubmit={this.handleSubmit}
            handleInput={this.handleInputChange}
          />
        </form>
      </div>
    );
  }
}
AddDocumentForm.contextType = UserContext;

export default AddDocumentForm;
