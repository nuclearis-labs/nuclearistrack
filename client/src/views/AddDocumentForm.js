import React, { Component } from 'react';
import FileSelector from '../components/FileSelector';
import axios from 'axios';

class AddDocumentForm extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      documentTitle: '',
      file: '',
      location: {},
      contract: this.props.match.params.contract
    };
  }

  handleFileChange(e) {
    this.setState({ file: e });
  }
  handleNameChange(e) {
    this.setState({ documentTitle: e.target.value });
  }

  componentDidMount() {
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
    return (
      <div className="container">
        <h1>Add Document</h1>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              className="form-control"
              onChange={this.handleNameChange}
              type="text"
              name="documentTitle"
            />
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

export default AddDocumentForm;
