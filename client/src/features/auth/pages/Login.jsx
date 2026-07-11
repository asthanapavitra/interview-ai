import React, { useState, useRef, useEffect } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../Loading";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin, handleGoogleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleWrapperRef = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(300);

  useEffect(() => {
    if (googleWrapperRef.current) {
      setGoogleWidth(googleWrapperRef.current.offsetWidth);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };
    await handleLogin(loginData);
    navigate("/");
  };

  const handleGoogle = async (credentialResponse) => {
    await handleGoogleAuth(credentialResponse);
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="abc@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Login</button>

          <div className="divider">OR</div>

          <div className="google-btn-wrapper" ref={googleWrapperRef}>
            <GoogleLogin
              onSuccess={(credentialResponse) => handleGoogle(credentialResponse)}
              onError={() => console.log("Google Login Failed")}
              theme="filled_black"
              shape="square"
              text="signin_with"
              size="large"
              logo_alignment="center"
              width={googleWidth}
            />
          </div>
        </form>

        <p>
          Don't have an account?{" "}
          <Link className="btn" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;