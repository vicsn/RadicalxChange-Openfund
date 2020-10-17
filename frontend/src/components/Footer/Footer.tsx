import React, { useContext } from "react";
import "./Footer.scss";
import { ActionContext } from "../../hooks";

function Footer() {
  const { setModalConfig } = useContext(ActionContext);
  const signupFormUrl = `${process.env.REACT_APP_SIGNUP_FORM_URL}`;
  const requestFormUrl = `${process.env.REACT_APP_REQUEST_FORM_URL}`;

  return (
    <div className="footer">
      <div className="footer-container-left container-spacing-set">
        <h3 className="top-margin-set">Get Involved</h3>
        <p className="top-margin-set">
          {" "}
          Interested in participating in the next Downtown Stimulus round for
          Boulder, Colorado? Do you want more information for bringing Downtown
          Stimulus to your town or region? Get in touch below!
        </p>
        <ul>
          <li>
            <a href={signupFormUrl} rel="noopener noreferrer" target="_blank">
              Boulder Business Sign-Up Form
            </a>
          </li>
          <li>
            <a href={requestFormUrl} rel="noopener noreferrer" target="_blank">
              Bring Downtown Stimulus to My Town
            </a>
          </li>
        </ul>
        <h3 className="top-margin-set">About Quadratic Funding</h3>
        <p className="top-margin-set">
          {" "}
          Downtown Stimulus is a democratic way of funding projects. They’ve put
          together a matching pool of $25k from local philanthropists that is going
          to be distributed to downtown Boulder Businesses, to help bridge the gap
          between normal and now. {/* eslint-disable-next-line */}
          <a onClick={(e) => setModalConfig(true, { type: "qfExplainer" })}>
            Read More
          </a>
        </p>

        <h3 className="top-margin-set">Legal Info</h3>
        <p className="top-margin-set bottom-margin-set">
          {" "}
          By accessing and using this website, you are acknowleding and agreeing to
          Downtown Stimulus's {/* eslint-disable-next-line */}
          <a onClick={(e) => setModalConfig(true, { type: "legalInfo" })}>
            Terms & Conditions and Privacy Policy
          </a>{" "}
        </p>
      </div>
      <div className="footer-container-right container-spacing-set">
        <h3 className="top-margin-set">Contact & Follow</h3>
        <div className="footer-contact-container top-margin-set">
          <span className="footer-contact-icon">
            <a href={"mailto: help@downtownstimulus.com"}>
              <img src={require("../../assets/email.svg")} alt="mail" />
            </a>
          </span>
          <span className="footer-contact-icon">
            <a
              href={"https://twitter.com/dtstimulus"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={require("../../assets/tw.svg")} alt="twitter" />
            </a>
          </span>
          <span className="footer-contact-icon">
            <a
              href={"https://medium.com/gitcoin"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={require("../../assets/medium.svg")} alt="medium" />
            </a>
          </span>
        </div>
        <h3 className="top-margin-set">Partners</h3>
        <div className="top-margin-set bottom-margin-set">
          <div className="footer-sponsors-icon">
            <a
              href={"https://gitcoin.co/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../assets/image 23.png")}
                alt="Gitcoin"
                className="footer-partner-logo"
              />
            </a>
          </div>
          <div className="footer-sponsors-icon">
            <a
              href={"https://labs.consensys.net/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  "https://labs.consensys.net/static/45c707c85b9d26f5c1eb2976856974a7/af144/consensys-labs-typeface-logo-white.png"
                }
                alt="ConsenSys Labs"
                className="footer-partner-logo"
              />
            </a>
          </div>
          <div className="footer-sponsors-icon">
            <a
              href={"https://www.boulderdowntown.com/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../assets/downtownboulderfoundation.png")}
                alt="Boulder Down Town"
                className="footer-partner-logo"
              />
            </a>
          </div>
        </div>
        <h4 className="footer-support-header">
          Pilot Funding proudly supported by:
        </h4>
        <ul>
          <li>
            <a href="https://feld.com" rel="noopener noreferrer" target="_blank">
              Brad Feld
            </a>
          </li>
          <li>
            <a
              href="https://gitcoin.co/grants"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitCoin Grantees
            </a>
          </li>
          <li>
            <a href="https://owocki.com" rel="noopener noreferrer" target="_blank">
              Kevin Owocki
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
