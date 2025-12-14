import { useEffect, useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUser, resetUserState } from "../../features/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, message, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  const handleClick = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }

    await dispatch(getUser({ email, password }));
  };

  useEffect(() => {
    if (isSuccess && user && Object.keys(user).length > 0) {
      navigate("/home");
    }
    else if (isError) {
      setErrorMessage(message || "Invalid email or password");
      dispatch(resetUserState());
    }
  }, [isSuccess, isError, message, user, navigate, dispatch]);

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Login</h3>

        <Form onSubmit={handleClick}>
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

          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>
              {errorMessage}
            </div>
          )}

          <Button color="dark" block className="signup-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <FormGroup>
            <p>
              Don't have an account? <Link to="/register">Sign up here...</Link>
            </p>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};

export default Login;
