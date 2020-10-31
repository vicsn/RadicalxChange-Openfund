import React, { useContext } from "react";
import "./Footer.scss";
import { ActionContext } from "../../hooks";

function Footer() {
  const { setModalConfig } = useContext(ActionContext);

  return (
    <div className="footer">
      <div className="footer-container-left container-spacing-set">
        <h3 className="top-margin-set">Get Involved</h3>
        <p className="top-margin-set">
          {" "}
          Interested in participating in the next RxC funding round? Want to
          contribute to the matching pool of RxC Openfund? Want to bring Openfund to
          your non-profit organization? Please Get in touch below.
        </p>
        <ul>
          <li>
            Want to contribute to the matching pool of RxC Openfund? Contact Matt
            Prewitt - matt@radicalxchange.org
          </li>
          <li>
            Bring Openfund to your non-profit organization. Contact Leon Erichsen -
            leon@radicalxchange.org
          </li>
        </ul>
        <h3 className="top-margin-set">About RxC Openfund</h3>
        <p className="top-margin-set">
          {" "}
          RadicalxChange Foundation is a nonprofit organization. Our work is free and
          public, to support the RxC movement. Almost all our activities rely on
          contributions from our community and philanthropic organizations. RxC
          Openfund uses Quadratice Funding (QF) to incentivize and govern funding for
          RadicalxChange Foundation. It allows people to contribute to their favorite
          RxC projects, e.g. conferences, fellowships, hackathons or podcasts. These
          contributions are matched by a fund from RadicalxChange Foundation.{" "}
          {/* eslint-disable-next-line */}
        </p>
      </div>
      <div className="footer-container-right container-spacing-set">
        <h3 className="top-margin-set">Legal Info</h3>
        <div className="footer-contact-container top-margin-set">
          <p>
            By accessing and using this website, you are acknowledging and agreeing
            to RadicalxChange Foundation's {/* eslint-disable-next-line */}
          <a onClick={(e) => setModalConfig(true, { type: "legalInfo" })}>
              Terms & Conditions and Privacy Policy
            </a>
          </p>
        </div>
        <h3 className="top-margin-set">Supporters</h3>
        <div className="top-margin-set bottom-margin-set">
          <div className="footer-sponsors-icon">
            <a
              href={"https://www.radicalxchange.org/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={require("../../assets/RXC_logo.svg")}
                alt="RadicalxChange Foundation"
                className="footer-partner-logo"
              />
            </a>
          </div>
        </div>
        <h3 className="top-margin-set">RxC Openfund Codebase</h3>
        <a href="https://github.com/vicsn/RadicalxChange-Openfund" rel="noopener noreferrer" target="_blank">
          <img
            src={require("../../assets/GitHub-Mark-64px.png")}
            alt="Github"
            className="footer-partner-logo"
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
