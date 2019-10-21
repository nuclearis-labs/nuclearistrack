import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProjectList from './views/ProjectList';
import Navbar from './components/Navbar';
import AddDocumentForm from './views/AddDocumentForm';
import AddProjectForm from './views/AddProjectForm';
import ProjectDetail from './views/ProjectDetail';
import AddProcessForm from './views/AddProcessForm';
import AddUser from './views/AddUser';
import DocumentDetail from './views/DocumentDetail';
import ClientDetail from './views/ClientDetail';
import UserList from './views/UserList';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/project-list">
          <ProjectList />
        </Route>
        <Route exact path="/project-detail/:contract">
          <ProjectDetail />
        </Route>
        <Route path="/add-document/:contract" component={AddDocumentForm} />
        <Route path="/add-process/:contract" component={AddProcessForm} />
        <Route path="/add-user">
          <AddUser />
        </Route>
        <Route path="/add-project">
          <AddProjectForm />
        </Route>
        <Route path="/client-detail/:address">
          <ClientDetail />
        </Route>
        <Route path="/user-list">
          <UserList />
        </Route>
        <Route path="/document-detail/">
          <DocumentDetail />
        </Route>
        <Route path="/">
          <h1>Bienvenido al Proof of Concept NRS PoE</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
