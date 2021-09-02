import * as React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Homescreen from "./pages/Homescreen";
import AuthContextProvider from "./state/AuthContext";
import StorageContextProvider from "./state/StorageContext";

export default function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <StorageContextProvider>
            <Switch>
              <Route path="/">
                <Homescreen />
              </Route>
            </Switch>
          </StorageContextProvider>
        </AuthContextProvider>
      </Router>
      <ToastContainer bodyClassName={() => "Toastify__toast-body text-sm font-medium text-palette-500"} />
    </>
  );
}
