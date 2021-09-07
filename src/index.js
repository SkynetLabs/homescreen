import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@fontsource/sora/400.css"; // normal
import "@fontsource/sora/600.css"; // semibold
import "@fontsource/sora/800.css"; // extrabold
import "@fontsource/source-sans-pro/400.css"; // normal
import "@fontsource/source-sans-pro/600.css"; // semibold
import "@fontsource/source-code-pro/600.css"; // semibold
import "@fontsource/source-code-pro/700.css"; // bold
import "react-toastify/dist/ReactToastify.css";
import "spinkit/spinkit.css";
import "./assets/main.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
