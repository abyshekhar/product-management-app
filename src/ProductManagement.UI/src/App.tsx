import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./utils/auth";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
  const auth = isLoggedIn();
  console.log("PrivateRoute check, logged in?", auth); // debug
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
