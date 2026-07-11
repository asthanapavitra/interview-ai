import { React, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const { loading, handleRegister, handleGoogleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const googleWrapperRef = useRef(null);
  const [googleWidth, setGoogleWidth] = useState(300);
  useEffect(() => {
    if (googleWrapperRef.current) {
      setGoogleWidth(googleWrapperRef.current.offsetWidth);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerData = {
      email,
      username,
      password,
    };
    await handleRegister(registerData);
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
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
              placeholder="Enter username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="Enter email address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Register</button>
          <div className="divider">OR</div>

          <div className="google-btn-wrapper" ref={googleWrapperRef}>
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                handleGoogle(credentialResponse)
              }
              onError={() => console.log("Google Login Failed")}
              theme="filled_black"
              shape="square"
              text="signup_with"
              size="large"
              logo_alignment="center"
              width={googleWidth}
            />
          </div>
        </form>

        <p>
          Already have an account?{" "}
          <Link className="btn" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
