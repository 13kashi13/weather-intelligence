import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="106502593804-ahl8m7nj3l40if1evqs3kjs2uan5md0b.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
