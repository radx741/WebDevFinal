import React from "react";
import { useDispatch } from "react-redux";
import { Nav, NavItem, Button } from "reactstrap";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom"; // <-- import NavLink from React Router
import { logoutUser } from "../../../../features/UserSlice";
import {
  FaTachometerAlt,
  FaBoxes,
  FaShoppingCart,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="sidebar d-flex flex-column align-items-start">
      <div className="sidebar-header text-center w-100">
        <h4 className="sidebar-title text-white">
          <FaTachometerAlt className="me-2" />
          Inventory Manager
        </h4>
        <div className="sidebar-divider"></div>
      </div>

      <Nav vertical className="w-100 mt-4">
        <NavItem>
          <RouterNavLink
            to="dashboard" // relative path to /home
            className="text-white sidebar-link"
            end
          >
            <FaTachometerAlt className="me-3 icon" />
            Dashboard
          </RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to="stock" className="text-white sidebar-link">
            <FaBoxes className="me-3 icon" />
            Stock Management
          </RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to="orders" className="text-white sidebar-link">
            <FaShoppingCart className="me-3 icon" />
            Orders
          </RouterNavLink>
        </NavItem>
        <NavItem>
          <RouterNavLink to="about" className="text-white sidebar-link">
            <FaInfoCircle className="me-3 icon" />
            About Us
          </RouterNavLink>
        </NavItem>
      </Nav>

      <div className="mt-auto w-100">
        <Button color="light" className="logout-btn w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
