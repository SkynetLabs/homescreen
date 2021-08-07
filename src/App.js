import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Homescreen from "./pages/Homescreen";
import SkynetContextProvider from "./state/SkynetContext";

export default function App() {
  return (
    <Router>
      <SkynetContextProvider>
        <Switch>
          <Route path="/">
            <Homescreen />
          </Route>
        </Switch>
      </SkynetContextProvider>
    </Router>
  );
}
