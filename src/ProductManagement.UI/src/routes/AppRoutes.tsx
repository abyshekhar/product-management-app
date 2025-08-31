import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/productsPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductsPage />} />
        {/* Add more routes here later (Login, Categories, etc.) */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
