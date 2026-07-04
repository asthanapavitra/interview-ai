import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const Login = () => {

  const navigate=useNavigate();
    const {loading,handleLogin}=useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();
    const loginData={
        email,password
    }
    await handleLogin(loginData);
  navigate('/')
  };

  if(loading){

    return (
        <main>
            <h1>
                Loading........
            </h1>
        </main>
    )
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
              onChange={(e)=>{
                setEmail(e.target.value)
              }}
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
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
              value={password}
              placeholder="Enter password"
            />
          </div>
          <button className="button primary-button">Login</button>
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
