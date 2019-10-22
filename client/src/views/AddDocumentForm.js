import React, { Component } from 'react';
import FileSelector from '../components/FileSelector';
import axios from 'axios';
import { UserContext } from '../context/userContext';

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
    this.setState({ [e.target.name]: e.target.value }, () => {
      console.log(this.state);
    });
  }

  componentDidMount() {
    axios
      .post('/api/user/get/0xCc71660E9Ad36d0275d27A8687407B75aD9cB02d')
      .then(({ data }) => this.setState({ projects: data.proyectos }));
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      this.setState({
        location: coords
      })
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();

    formData.append('file', this.state.file);
    formData.append('documentTitle', this.state.documentTitle);
    formData.append('email', 'info@imeco.com');
    formData.append('passphrase', 'imeco');
    axios
      .post(`/api/doc/upload/${this.state.contract}`, formData, {
        'Content-Type': 'multipart/form-data'
      })
      .then(result => console.log(result));
  }

  render() {
    let user = this.context;
    return (
      <div className="container">
        <h1>Add Document</h1>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              className="form-control"
              onChange={this.handleInputChange}
              type="text"
              name="documentTitle"
            />
          </div>
          <div className="form-group">
            <label htmlFor="project">Project</label>
            <select
              className="form-control"
              onChange={this.handleInputChange}
              name="contract"
            >
              {this.state.projects.length > 0 &&
                this.state.projects.map(project => (
                  <option value={project[3]}>
                    {project[1] + ' / ' + project[0]}
                  </option>
                ))}
            </select>
          </div>
          <FileSelector onFileChange={this.handleFileChange} />
          <div className="form-group">
            <label htmlFor="location">
              Location{' '}
              <a
                href={
                  'https://www.google.com/maps/@' +
                  this.state.location.latitude +
                  ',' +
                  this.state.location.longitude +
                  ',z20'
                }
              >
                (see in Maps)
              </a>
            </label>
            <input
              className="form-control"
              value={
                this.state.location.latitude +
                ',' +
                this.state.location.longitude
              }
              type="text"
              name="name"
              readOnly
            />
          </div>
          <button onClick={this.handleSubmit} class="btn btn-primary">
            Upload
          </button>
        </form>
      </div>
    );
  }
}
AddDocumentForm.contextType = UserContext;

export default AddDocumentForm;
