import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { FaBullseye, FaLightbulb } from "react-icons/fa";
import "./about.css";

export const About = () => {
  return (
    <Container fluid className="about-page py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="about-card shadow-lg p-5">
            <CardBody>
              <h1 className="text-center mb-5 about-title">About Us</h1>
              
              <p className="about-text mb-4">
                Welcome to our <strong>Inventory Management System</strong>, a project designed to help businesses efficiently track, organize, and manage their products in real-time. Our goal is to simplify inventory control, reduce errors, and improve decision-making through automation and data-driven insights.
              </p>

              <div className="goal-section mb-4">
                <h3 className="d-flex align-items-center mb-3">
                  <FaBullseye className="me-3 text-primary" /> Goal
                </h3>
                <p className="about-text">
                  We developed this system to address common challenges faced by small and medium enterprises — such as overstocking, stockouts, and manual record errors. By providing an easy-to-use dashboard, automatic alerts, and detailed reports, our platform empowers users to maintain accurate stock levels and streamline operations.
                </p>
              </div>

              <div className="vision-section">
                <h3 className="d-flex align-items-center mb-3">
                  <FaLightbulb className="me-3 text-warning" /> Vision
                </h3>
                <p className="about-text">
                  Our vision is to enable businesses of all sizes to operate efficiently
                   and make smarter inventory decisions through technology.
                    We aim to reduce errors and save time for our users.
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
