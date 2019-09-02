import React from 'react'
import { Route, Switch } from "react-router-dom";
import './App.css'
import Header from './components/Header.js'
import Footer from './components/Footer'
import Index from './pages/Index';
import CreateDocument from './pages/CreateDocument';

function App() {
    return (
        <div className="App">
            <Header />
            <Switch>
                <Route exact path="/" component={Index} />
                <Route exact path="/add" component={CreateDocument} />
            </Switch>
            <Footer />
        </div>
    )
}

export default App
