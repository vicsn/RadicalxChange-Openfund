import React, { useContext, useState } from "react";
import "./Login.scss";
import SocialLogin from "../SocialLogin";
import { ActionContext } from "../../hooks";
import { WebService } from "../../services";

function Login() {
  const { setModalConfig, setUserData, showAlert } = useContext(ActionContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (isFieldNonEmpty()) {
      WebService.loginUser({ username: email, password }).subscribe(async (data) => {
        if (data.ok) {
          const user = await data.json();
          setUserData(user);
          setModalConfig(false, { type: "" });
        } else {
          const error = await data.json();
          Object.keys(error).forEach((key) => {
            showAlert(error[key].join());
          });
        }
      });
    } else {
      showAlert("Please fill all the fields");
    }
  };

  const isFieldNonEmpty = () => {
    if (email && password) {
      return true;
    }
    return false;
  };
  return (
    <div className="login">
      <h2 className="login-header">Connect with Downtown Stimulus</h2>
      <SocialLogin type="login" />
      <p className="login-text top-margin-set">Or login with your email!</p>
      <div className="login-input-container top-margin-set">
        <label className="login-input-label">Email</label>
        <input
          type="email"
          placeholder="e.g. John Doe"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="login-input-container top-margin-set">
        <label className="login-input-label">Password</label>
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="login-create-link-container top-margin-set">
        {/* eslint-disable-next-line */}
        <a
          className="login-create-link"
          onClick={(e) => setModalConfig(true, { type: "signUp" })}
        >
          Need to create an account? Click here!
        </a>
      </div>
      <div className="login-email-submit-container top-margin-set">
        <button type="button" className="login-email-submit-button" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
