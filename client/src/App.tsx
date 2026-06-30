import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import TablesPage from "./pages/TablesPage";
import MenuPage from "./pages/MenuPage";
import KitchenPage from "./pages/KitchenPage";
import AdminDashboard from "./pages/AdminDashboard";
import TableOrderPage from "./pages/TableOrderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== */}
        {/* PUBLIC ROUTES */}
        {/* ===================== */}

        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ===================== */}
        {/* ADMIN */}
        {/* ===================== */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ===================== */}
        {/* WAITER */}
        {/* ===================== */}
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/menu/:tableId" element={<MenuPage />} />

        {/* ===================== */}
        {/* KITCHEN (CHEF) */}
        {/* ===================== */}
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/table/:tableId" element={<TableOrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;