import React from "react";
import { Route, Switch } from "react-router-dom";
import "semantic-ui-less/semantic.less";
import Navbar from "./components/Navbar";
import Index from "./components/Index";
import { Container } from "semantic-ui-react";
import Subir from "./components/Subir";
import Chequear from "./components/Chequear";
import Acceder from "./components/Acceder";
import Listado from "./components/Listado";
import Progress from "./components/Progress";

function App() {
  return (
    <Container style={{ marginTop: "1em" }}>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/listado" component={Listado} />
        <Route exact path="/subir" component={Subir} />
        <Route exact path="/chequear" component={Chequear} />
        <Route exact path="/acceder" component={Acceder} />
        <Route exact path="/progress" component={Progress} />
      </Switch>
    </Container>
  );
}

export default App;
