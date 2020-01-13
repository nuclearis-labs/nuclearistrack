import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './components/globalStyle';
import Header from './components/header.js';
import Footer from './components/footer.js';
import NewProject from './pages/newProject';
import NewProcess from './pages/newProcess';
import NewUser from './pages/newUser';
import ConfirmUser from './pages/confirmUser';
import styled from 'styled-components';
import { Title } from './components/components';
import { UserProvider } from './context/userContext';
import { ListProject } from './pages/listProject';
import { ListProcess } from './pages/listProcess';
import { Login } from './pages/login';
import { ListUser } from './pages/listUser';

const AppWrapper = styled.div`
  background-color: #fafafa;
`;

function App() {
  return (
    <UserProvider>
      <Router>
        <GlobalStyle />
        <Switch>
          <AppWrapper>
            <Header />
            <Route path="/projects/add" component={NewProject} />
            <Route path="/projects" exact component={ListProject} />
            <Route path="/processes/add" component={NewProcess} />
            <Route path="/processes" exact component={ListProcess} />
            <Route path="/users/add" component={NewUser} />
            <Route path="/users/confirm/:id" component={ConfirmUser} />
            <Route path="/users" exact component={ListUser} />
            <Route path="/login" exact component={Login} />
            <Route path="/" exact>
              <Title>Welcome {}</Title>
            </Route>
            <Footer />
          </AppWrapper>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
