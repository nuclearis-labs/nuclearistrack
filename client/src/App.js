import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProjectList from './views/ProjectList';
import Navbar from './components/Navbar';
import AddDocumentForm from './views/AddDocumentForm';
import VerifyDocumentForm from './views/VerifyDocumentForm';
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

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Switch>
          <Route path="/project-list" component={ProjectList} />
          <Route
            exact
            path="/project-detail/:contract"
            component={ProjectDetail}
          />
          <Route path="/add-document/" component={AddDocumentForm} />
          <Route path="/verify-document/" component={VerifyDocumentForm} />
          <Route path="/add-process/:contract" component={AddProcessForm} />
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
