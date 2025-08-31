// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px" }}>
        Home
      </Link>

      {user ? (
        <>
          {user.role === "Admin" && (
            <>
              <Link to="/products" style={{ marginRight: "10px" }}>
                Products
              </Link>
              <Link to="/categories" style={{ marginRight: "10px" }}>
                Categories
              </Link>
            </>
          )}
          {user.role === "User" && <Link to="/dashboard">Dashboard</Link>}
          <span style={{ marginRight: "10px" }}>Hello, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
