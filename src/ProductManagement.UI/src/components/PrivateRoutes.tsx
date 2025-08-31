import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

interface Props {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
