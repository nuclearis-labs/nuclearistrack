import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './components/globalStyle';
import Header from './components/header.js';
import NewProject from './pages/newProject';
import NewProcess from './pages/newProcess';
import NewUser from './pages/newUser';
import ConfirmUser from './pages/confirmUser';
import styled from 'styled-components';
import { Title, Wrap } from './components/components';
import { Top, Form, FormWrap } from './components/form.js';
import PrivateRoute from './components/privateRoute';
import { UserProvider } from './context/userContext';
import { Login } from './pages/login';
import Projects from './pages/projects';
import Processes from './pages/processes';
import Users from './pages/users';
import NoMatch from './pages/NoMatch';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Security from './pages/Security';
import FAQ from './pages/FAQ';

const AppWrapper = styled.div`
  background-color: #fafafa;
`;

function App() {
  return (
    <UserProvider>
      <Router>
        <GlobalStyle />
        <AppWrapper>
          <Switch>
            <PrivateRoute path="/projects/add" component={NewProject} />
            <PrivateRoute exact path="/projects" component={Projects} />
            <PrivateRoute path="/processes/add" component={NewProcess} />
            <PrivateRoute exact path="/processes" component={Processes} />
            <PrivateRoute path="/users/add" component={NewUser} />
            <PrivateRoute path="/users/confirm/:id" component={ConfirmUser} />
            <PrivateRoute exact path="/users">
              <Users />
            </PrivateRoute>
            <Route path="/login" exact component={Login} />
            <Route path="/benefits" component={Benefits} />
            <Route path="/security" component={Security} />
            <Route path="/faq" component={FAQ} />
            <Route path="/contact" component={Contact} />
            <Route path="/" exact component={Home} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </AppWrapper>
      </Router>
    </UserProvider>
  );
}

export default App;
