import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import App from "./App";
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from "./UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <UserContextProvider >
      <App />
    </UserContextProvider>
    <ToastContainer />
  </Router>
);
