import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './components/globalStyle';
import NewProject from './pages/newProject';
import NewProcess from './pages/newProcess';
import NewUser from './pages/newUser';
import ConfirmUser from './pages/confirmUser';
import styled from 'styled-components';
import PrivateRoute from './components/privateRoute';
import { UserProvider } from './context/userContext';
import { Login } from './pages/login';
import Projects from './pages/projects';
import Processes from './pages/processes';
import Users from './pages/users';
import Transfer from './pages/Transfer';
import NoMatch from './pages/NoMatch';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Security from './pages/Security';
import FAQ from './pages/FAQ';
import NewDocument from './pages/newDocument';
import Document from './pages/documents';
import Settings from './pages/Settings';
import Documents from './pages/documentsDetail';
import Header from './components/header';

const AppWrapper = styled.div`
  background-color: #fafafa;
`;

const base = '/:locale(en|sp|de)?';

function App() {
  return (
    <UserProvider>
      <Router>
        <GlobalStyle />
        <AppWrapper>
          <Route path={base} component={Header} />

          <Switch>
            <PrivateRoute
              path={`${base}/projects/add`}
              component={NewProject}
            />
            <PrivateRoute
              exact
              path={`${base}/projects`}
              component={Projects}
            />
            <PrivateRoute
              path={`${base}/processes/add`}
              component={NewProcess}
            />
            <PrivateRoute
              exact
              path={`${base}/processes`}
              component={Processes}
            />
            <PrivateRoute path={`${base}/users/add`} component={NewUser} />
            <PrivateRoute exact path={`${base}/users`} component={Users} />
            <PrivateRoute
              path={`${base}/documents/add/:process`}
              component={NewDocument}
            />
            <PrivateRoute
              exact
              path={`${base}/documents/:process`}
              component={Document}
            />
            <PrivateRoute
              exact
              path={`${base}/documents/:process/:hash`}
              component={Documents}
            />
            <PrivateRoute path={`${base}/settings`} component={Settings} />
            <Route path={`${base}/users/confirm/:id`} component={ConfirmUser} />
            <Route path={`${base}/login`} exact component={Login} />
            <Route path={`${base}/transfer`} exact component={Transfer} />
            <Route path={`${base}/benefits`} component={Benefits} />
            <Route path={`${base}/security`} component={Security} />
            <Route path={`${base}/faq`} component={FAQ} />
            <Route path={`${base}/contact`} component={Contact} />
            <Route path={base} exact component={Home} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </AppWrapper>
      </Router>
    </UserProvider>
  );
}

export default App;
