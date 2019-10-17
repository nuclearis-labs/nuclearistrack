import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProjectList from './views/ProjectList';
import Navbar from './components/Navbar';
import AddDocumentForm from './views/AddDocumentForm';
import AddProjectForm from './views/AddProjectForm';
import ProjectDetails from './views/ProjectDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/project-list">
          <ProjectList />
        </Route>
        <Route exact path="/project-detail/:contract">
          <ProjectDetails />
        </Route>
        <Route path="/add-document">
          <AddDocumentForm />
        </Route>
        <Route path="/add-project">
          <AddProjectForm />
        </Route>
        <Route path="/">
          <h1>Bienvenido al Proof of Concept NRS PoE</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
