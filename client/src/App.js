import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AddProject from './components/AddProject';
import ProjectList from './components/ProjectList';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/addProject">AddProject</Link>
            </li>
            <li>
              <Link to="/projectList">ProjectList</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/addProject">
            <AddProject />
          </Route>
          <Route path="/projectList">
            <ProjectList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
