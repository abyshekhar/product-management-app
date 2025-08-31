import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/AuthContext";
import Navbar from "./components/Navbar";
import "./index.css";
import React from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Navbar /> {/* Now inside BrowserRouter */}
        <AppRoutes /> {/* Routes also inside BrowserRouter */}
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
