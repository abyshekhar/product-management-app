import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // hide if not logged in

  return (
    <nav>
      <Link to="/products">Products</Link> |{" "}
      <Link to="/categories">Categories</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;
