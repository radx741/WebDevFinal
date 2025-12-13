import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Outlet } from "react-router-dom"; // <-- import Outlet
import Sidebar from "./home content/sidebar/Sidebar";
import "./home.css"; 

export const Home = () => {
  return (
    <div className="home-layout d-flex">

      <Sidebar />

      <Container fluid className="home-content p-4">
        <Row>
          <Col>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
