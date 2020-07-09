import React, { useContext, useState } from "react";
import "./SignUp.scss";
import SocialLogin from "../SocialLogin";
import { ActionContext } from "../../hooks";
import { WebService } from "../../services";
// import { GoogleReCaptchaProvider, GoogleReCaptcha } from "react-google-recaptcha-v3";
// import { TEST_SITE_KEY } from "../../config";
import {
  containsSpecialCharacters,
  containsUpperCase,
  containsLowerCase,
  containsNumber,
  validateEmail,
  validatePasswordLength,
} from "../../utils";

function SignUp() {
  const { setModalConfig, showAlert } = useContext(ActionContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  // const [token, setToken] = useState("");

  const signUp = () => {
    // console.log(firstName, lastName, email, password, rePassword);
    if (isFieldNonEmpty()) {
      // if (token) {
      if (validateEmail(email)) {
        if (password === rePassword) {
          if (validatePasswordLength(password)) {
            if (containsSpecialCharacters(password)) {
              if (containsUpperCase(password)) {
                if (containsLowerCase(password)) {
                  if (containsNumber(password)) {
                    WebService.postUser({
                      username: email,
                      email,
                      password,
                      first_name: firstName,
                      last_name: lastName,
                    }).subscribe(async (data) => {
                      if (data.ok) {
                        setModalConfig(true, { type: "confirmMail" });
                      } else {
                        const error = await data.json();
                        Object.keys(error).forEach((key) => {
                          showAlert(error[key].join());
                        });
                      }
                    });
                  } else {
                    showAlert("Password must contains a number");
                  }
                } else {
                  showAlert("Password must contains lower case");
                }
              } else {
                showAlert("Password must contains upper case");
              }
            } else {
              showAlert("Password must contains a special character");
            }
          } else {
            showAlert("Password length must be at least 8 characters");
          }
        } else {
          showAlert("Re typed password does not match");
        }
      } else {
        showAlert("Please enter correct email address");
      }
      // } else {
      //   showAlert("Please verify recaptcha");
      // }
    } else {
      showAlert("Please fill all the fields");
    }
  };
  // const handleRecapchaChange = (value: any) => {
  //   setToken(value);
  // };
  const isFieldNonEmpty = () => {
    if (firstName && lastName && email && password && rePassword) {
      return true;
    }
    return false;
  };
  return (
    <div className="signUp">
      <h2 className="login-header top-margin-set">Create an Account</h2>
      <SocialLogin type="signUp" />
      <p className="login-text top-margin-set">
        Or create an account with your email address!
      </p>
      <div className="login-container">
        <div className="login-input-container top-margin-set right-margin-set">
          <label className="login-input-label">First Name</label>
          <input
            type="text"
            placeholder="e.g. John"
            className="login-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="login-input-container top-margin-set">
          <label className="login-input-label">Last Name</label>
          <input
            type="text"
            placeholder="e.g. Doe"
            className="login-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="login-input-container top-margin-set">
        <label className="login-input-label">Email</label>
        <input
          type="email"
          placeholder="e.g. john.doe@gmail.com"
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
        <span className="password-tag">
          Must have at-least 8 char, a digit, lower alphabet, upper alphabet &
          special char.
        </span>
      </div>
      <div className="login-input-container top-margin-set">
        <label className="login-input-label">Re-enter Password</label>
        <input
          type="password"
          className="login-input"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
      </div>
      {/* <div className="login-input-container middle-align top-margin-set">
        <GoogleReCaptchaProvider reCaptchaKey={TEST_SITE_KEY}>
          <GoogleReCaptcha onVerify={(token) => handleRecapchaChange(token)} />
        </GoogleReCaptchaProvider>
      </div> */}
      <div className="login-create-link-container top-margin-set">
        {/* eslint-disable-next-line */}
        <a
          className="login-create-link"
          onClick={(e) => setModalConfig(true, { type: "login" })}
        >
          Already have an account? Log in here.
        </a>
      </div>
      <div className="login-email-submit-container top-margin-set">
        <button type="button" className="login-email-submit-button" onClick={signUp}>
          Create Account
        </button>
      </div>
    </div>
  );
}

export default SignUp;
