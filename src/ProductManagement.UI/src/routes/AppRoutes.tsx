import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import CategoriesPage from "../pages/CategoriesPage";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "../components/PrivateRoutes";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin-only routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute roles={["Admin"]}>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute roles={["Admin"]}>
              <CategoriesPage />
            </PrivateRoute>
          }
        />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
};

export default AppRoutes;
