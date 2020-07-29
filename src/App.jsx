import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalStyle from './styles/globalStyle';
import { UserContext } from './context/UserContext';
import useWeb3 from './hooks/useWeb3';
import Home from './pages/Home';
import Footer from './components/Footer';
import Header from './components/Header';
import Loading from './pages/Loading';
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const Projects = lazy(() => import('./pages/ProjectList'));
const Processes = lazy(() => import('./pages/ProcessList'));
const Users = lazy(() => import('./pages/UserList'));
const NoMatch = lazy(() => import('./pages/NoMatch'));
const Contact = lazy(() => import('./pages/Contact'));
const Benefits = lazy(() => import('./pages/Benefits'));
const Abstract = lazy(() => import('./pages/Abstract'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const NewProcess = lazy(() => import('./pages/NewProcess'));
const NewProject = lazy(() => import('./pages/NewProject'));
const NewUser = lazy(() => import('./pages/NewUser'));
const NewDocument = lazy(() => import('./pages/NewDocument'));
const Document = lazy(() => import('./pages/DocumentDetail'));
const Documents = lazy(() => import('./pages/DocumentList'));

const AppWrapper = styled.div`
  background-color: #fafafa;
`;

function App() {
  const {
    isLoading,
    isReady,
    isConnected,
    connect,
    account,
    contract,
    web3,
  } = useWeb3();
  return (
    <UserContext.Provider
      value={{
        isLoading,
        isReady,
        isConnected,
        connect,
        account,
        web3,
        contract,
      }}
    >
      <Router>
        <GlobalStyle />
        <AppWrapper>
          <Header />
          <Suspense fallback={<Loading />}>
            <Switch>
              <PrivateRoute path={`/projects/add`}>
                <NewProject />
              </PrivateRoute>
              <PrivateRoute exact={true} path={`/projects`}>
                <Projects />
              </PrivateRoute>
              <PrivateRoute path={`/processes/add`}>
                <NewProcess />
              </PrivateRoute>
              <PrivateRoute exact={true} path={`/processes`}>
                <Processes />
              </PrivateRoute>
              <PrivateRoute path={`/users/add`}>
                <NewUser />
              </PrivateRoute>
              <PrivateRoute exact={true} path={`/users`}>
                <Users />
              </PrivateRoute>
              <PrivateRoute path={`/documents/add/:process`}>
                <NewDocument />
              </PrivateRoute>
              <PrivateRoute exact={true} path={`/documents/:process`}>
                <Documents />
              </PrivateRoute>
              <PrivateRoute exact={true} path={`/documents/:process/:hash`}>
                <Document />
              </PrivateRoute>

              <Route path={`/benefits`} component={Benefits} />
              <Route path={`/abstract`} component={Abstract} />
              <Route path={`/login`} component={Login} />
              <Route path={`/faq`} component={FAQ} />
              <Route path={`/contact`} component={Contact} />
              <Route path={'/'} exact component={Home} />
              <Route path="*" component={NoMatch} />
            </Switch>
          </Suspense>
          <Footer />
        </AppWrapper>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
