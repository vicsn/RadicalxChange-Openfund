import React from "react";
import "./ConfirmMail.scss";

function ConfirmMail() {
  return (
    <div className="confirm-mail">
      <h2 className="top-margin-set text-center">
        Thank you for Creating an Account!
      </h2>
      <p className="top-margin-set text-center">
        You should a receive a confirmation email. Please click on the link to
        confirm your email account with us!
      </p>
      <p className=" text-center">
        Don’t see an email? Be sure to check your spam folders just in case.
      </p>
    </div>
  );
}

export default ConfirmMail;
