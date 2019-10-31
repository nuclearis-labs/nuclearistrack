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
import Home from './views/Home';
import TransferView from './views/TransferView';
import { UserProvider } from './context/UserContext';
import LoginForm from './views/LoginForm';
import AssignProcess from './views/AssignProcess';
import ProcessList from './views/ProcessList';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Switch>
          <Route path="/project-list" component={ProjectList} />
          <Route path="/process-list" component={ProcessList} />
          <Route
            exact
            path="/project-detail/:contract"
            component={ProjectDetail}
          />
          <Route path="/add-document/" component={AddDocumentForm} />
          <Route path="/add-process" component={AddProcessForm} />
          <Route path="/assign-process" component={AssignProcess} />
          <Route path="/add-user" component={AddUser} />
          <Route path="/add-project" component={AddProjectForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/client-detail/:address" component={ClientDetail} />
          <Route path="/user-list" component={UserList} />
          <Route path="/transfer" component={TransferView} />
          <Route
            path="/document-detail/:contract/:hash"
            component={DocumentDetail}
          />
          <Route path="/" component={Home} />
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
