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
import { Title, Wrap } from './components/components';
import { Top, Form, FormWrap } from './components/form.js';

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
              <Wrap>
                <Top>
                  <Title>Bienvenido</Title>
                </Top>
                <FormWrap>
                  <Form>
                    <p>
                      Esta todo muy en construcción, pero ya existen las
                      siguientes funcionalidades:
                    </p>
                    <ul>
                      <li>Crear proyectos nuevos</li>
                      <li>Crear usuarios nuevos</li>
                      <li>Crear procesos nuevos</li>
                    </ul>
                    <ul>
                      <li>El usuario puede confirmar su usuario</li>
                    </ul>
                    <ul>
                      <li>Listar todos los proyectos</li>
                      <li>Listar todos los procesos</li>
                      <li>Listar todos los usuarios</li>
                    </ul>
                    <ul>
                      <li>
                        Ingresar como usuario info@nuclearis.com / Nuclearis
                      </li>
                      <li>Cerrar session</li>
                    </ul>
                  </Form>
                </FormWrap>
              </Wrap>
            </Route>
            <Footer />
          </AppWrapper>
        </Switch>
      </Router>
    </UserProvider>
  );
}

export default App;
