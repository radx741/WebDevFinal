import 'bootstrap/dist/css/bootstrap.css';
import Login from "./components/login/Login";
import { Registeration } from "./components/register/Registeration";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/home/Home";
import { Dashboard } from './components/home/home content/dashboard/Dashboard';
import { Stock } from './components/home/home content/stock/Stock';
import { Orders } from './components/home/home content/orders/Orders';
import { About } from './components/home/home content/about/About';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registeration />} />

      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }>
        {/* Default page when entering /home */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="orders" element={<Orders />} />
        <Route path="about" element={<About />} />
      </Route>

    </Routes>
  );
}

export default App;
