import React, { Component } from 'react';

class FileSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { file: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onFileChange(e.target.files[0]);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="file">File to upload</label>
        <input
          className="form-control-file"
          onChange={this.handleChange}
          id="file"
          type="file"
          name="file"
        />
      </div>
    );
  }
}
export default FileSelector;
