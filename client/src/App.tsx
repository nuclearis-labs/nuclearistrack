import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './styles/globalStyle';
import NewProject from './pages/NewProject';
import NewProcess from './pages/NewProcess';
import NewUser from './pages/NewUser';
import EditUser from './pages/EditUser';
import ConfirmUser from './pages/ConfirmUser';
import styled from 'styled-components';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Projects from './pages/ProjectList';
import Processes from './pages/ProcessList';
import Users from './pages/UserList';
import Transfer from './pages/Transfer';
import NoMatch from './pages/NoMatch';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Security from './pages/Abstract';
import FAQ from './pages/FAQ';
import NewDocument from './pages/NewDocument';
import Document from './pages/DocumentList';
import Settings from './pages/Settings';
import Documents from './pages/DocumentDetail';
import Header from './components/Header';
const AppWrapper = styled.div`
  background-color: #fafafa;
`;

const base = '/:locale(en|sp|de)?';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppWrapper>
        <Route path={base} component={Header} />

        <Switch>
          <PrivateRoute
            roles="project:create"
            path={`${base}/projects/add`}
            component={NewProject}
          />
          <PrivateRoute
            exact={true}
            roles="project:read"
            path={`${base}/projects`}
            component={Projects}
          />
          <PrivateRoute
            roles="process:create"
            path={`${base}/processes/add`}
            component={NewProcess}
          />
          <PrivateRoute
            exact={true}
            roles="process:read"
            path={`${base}/processes`}
            component={Processes}
          />
          <PrivateRoute
            roles="user:create"
            path={`${base}/users/add`}
            component={NewUser}
          />
          <PrivateRoute
            roles="user:read"
            exact={true}
            path={`${base}/users`}
            component={Users}
          />
          <PrivateRoute
            roles="user:edit"
            path={`${base}/users/edit/:userId`}
            component={EditUser}
          />
          <PrivateRoute
            roles="document:create"
            path={`${base}/documents/add/:process`}
            component={NewDocument}
          />
          <PrivateRoute
            roles="documents:read"
            exact={true}
            path={`${base}/documents/:process`}
            component={Document}
          />
          <PrivateRoute
            roles="document:read"
            exact={true}
            path={`${base}/documents/:process/:hash`}
            component={Documents}
          />
          <PrivateRoute
            roles="user:settings"
            path={`${base}/settings`}
            component={Settings}
          />
          <PrivateRoute
            roles="admin:transfer"
            path={`${base}/transfer`}
            exact={true}
            component={Transfer}
          />
          <Route path={`${base}/users/confirm/:id`} component={ConfirmUser} />
          <Route path={`${base}/login`} exact component={Login} />
          <Route path={`${base}/benefits`} component={Benefits} />
          <Route path={`${base}/security`} component={Security} />
          <Route path={`${base}/faq`} component={FAQ} />
          <Route path={`${base}/contact`} component={Contact} />
          <Route path={base} exact component={Home} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </AppWrapper>
    </Router>
  );
}

export default App;
