import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './styles/globalStyle';
import NewProject from './pages/NewProject';
import NewProcess from './pages/NewProcess';
import NewUser from './pages/NewUser';
import PrivateRoute from './components/PrivateRoute';
import Projects from './pages/ProjectList';
import Processes from './pages/ProcessList';
import Users from './pages/UserList';
import NoMatch from './pages/NoMatch';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Abstract from './pages/Abstract';
import FAQ from './pages/FAQ';
import NewDocument from './pages/NewDocument';
import Document from './pages/DocumentList';
import Login from './pages/Login';
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
          <PrivateRoute path={`${base}/projects/add`} component={NewProject} />
          <PrivateRoute
            exact={true}
            path={`${base}/projects`}
            component={Projects}
          />
          <PrivateRoute path={`${base}/processes/add`} component={NewProcess} />
          <PrivateRoute
            exact={true}
            path={`${base}/processes`}
            component={Processes}
          />
          <PrivateRoute path={`${base}/users/add`} component={NewUser} />
          <PrivateRoute exact={true} path={`${base}/users`} component={Users} />
          <PrivateRoute
            path={`${base}/documents/add/:process`}
            component={NewDocument}
          />
          <PrivateRoute
            exact={true}
            path={`${base}/documents/:process`}
            component={Document}
          />
          <PrivateRoute
            exact={true}
            path={`${base}/documents/:process/:hash`}
            component={Documents}
          />
          <Route path={`${base}/benefits`} component={Benefits} />
          <Route path={`${base}/abstract`} component={Abstract} />
          <Route path={`${base}/login`} component={Login} />
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
