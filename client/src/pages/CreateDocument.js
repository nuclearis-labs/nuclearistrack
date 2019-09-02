import React, { useState } from 'react';
import axios from "axios";

export default function CreateDocument() {

    const [file, setFile] = useState({});

    function handleChange(evt) {
        evt.preventDefault();
        setFile(evt.target.files);
    }

    function handleSubmit(evt) {

    }

    return (<div class="container">
        <h1>Subir archivos</h1>
        <input type="file" placeholder="Hello" onChange={handleChange} style={{ "display": "block" }} />
        <button onClick={handleSubmit}>Subir archivo</button>
    </div>)
}