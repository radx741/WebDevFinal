import { useEffect, useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addUser, resetUserState } from "../../features/UserSlice";
import { useNavigate } from "react-router-dom";
import "./registeration.css";

export const Registeration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, message, isLoading } = useSelector(
    (state) => state.user
  );

  //Reset Redux state on component load
  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !repPassword) {
      alert("Please fill all fields");
      return;
    }
    else {
      if (password !== repPassword) {
        alert("Passwords do not match");
        return;
      }
      else {
        const Data = {
          name: name,
          email: email,
          password: password,
        };

        await dispatch(addUser(Data));

      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      alert(message || "Registration successful");
      dispatch(resetUserState());
      navigate("/");
    }
    else if (isError) {
      alert(message || "Registration failed");
      dispatch(resetUserState());
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <div className="register-container">
      <div className="register-card">
        <button
          className="back-button"
          onClick={() => navigate("/")}
          type="button"
          aria-label="Go back to login"
        >
          <FaArrowLeft />
        </button>
        <h3 className="register-title">Registration</h3>

        <Form onSubmit={handleClick}>
          <FormGroup className="input-group">
            <FaUser className="input-icon" />
            <Input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup className="input-group">
            <FaEnvelope className="input-icon" />
            <Input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup className="input-group">
            <FaLock className="input-icon" />
            <Input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup className="input-group">
            <FaLock className="input-icon" />
            <Input
              type="password"
              name="repPassword"
              placeholder="Confirm your Password"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
              required
            />
          </FormGroup>

          <Button
            color="dark"
            block
            className="signup-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Sign up"}
          </Button>
        </Form>
      </div>
    </div>
  );
};