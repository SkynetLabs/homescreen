import * as React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Homescreen from "./pages/Homescreen";
import AuthContextProvider from "./state/AuthContext";
import StorageContextProvider from "./state/StorageContext";
import StateContextProvider from "./state/StateContext";

export default function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <StorageContextProvider>
            <StateContextProvider>
              <Routes>
                <Route path="*" element={<Homescreen />} />
              </Routes>
            </StateContextProvider>
          </StorageContextProvider>
        </AuthContextProvider>
      </Router>
      <ToastContainer bodyClassName={() => "Toastify__toast-body text-sm font-medium text-palette-500"} />
    </>
  );
}
