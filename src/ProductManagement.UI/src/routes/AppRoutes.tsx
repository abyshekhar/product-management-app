import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage"; // create this page
import { useAuth } from "../hooks/AuthContext"; // custom hook to get auth state
import type { JSX } from "react";

// PrivateRoute wrapper
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth(); // get logged-in user
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        {/* Add more routes here later (Categories, etc.) */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
