import React, { useContext, useState } from "react";
import "./Header.scss";
import { ChevronDown, ChevronUp } from "react-feather";
import { ActionContext, StateContext } from "../../hooks";
import { Link, useLocation } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";

function Header() {
  const location = useLocation();
  const { setModalConfig, logoutUser } = useContext(ActionContext);
  const { user } = useContext(StateContext);
  const [dropdownActive, setDropdownActive] = useState(false);
  return (
    <div
      className={`header ${location.pathname !== "/" ? "header-with-shadow" : ""}`}
    >
      <Link to="/" className="header-home-container">
        <img src={require("../../assets/RXC_logo.svg")} alt={"RXC logo"} width="70vmin" height="70vmin" />
      </Link>
      <div className="header-profile-container">
        {user ? (
          <>
            <img
              src={
                user.profile_pic
                  ? user.profile_pic
                  : user.email
                    ? makeBlockie(user.email)
                    : null
              }
              alt="profile"
              className="profile-icon"
            />
            <div
              className="header-profile-drop-down-icon"
              onClick={(e) => setDropdownActive(!dropdownActive)}
            >
              {!dropdownActive ? (
                <ChevronDown></ChevronDown>
              ) : (
                  <ChevronUp></ChevronUp>
                )}
            </div>
          </>
        ) : (
            <>
              <div className="profile-item">
                <button type="button" className="profile-item-button" onClick={(e) => setModalConfig(true, { type: "signUp" })}>
                  Sign Up
                </button>
              </div>
              <div className="profile-item">
                <button type="button" className="profile-item-button" onClick={(e) => setModalConfig(true, { type: "login" })}>
                  Login
                </button>
              </div>
            </>
          )}
        {dropdownActive && (
          <div
            className="menu-overlay"
            onClick={(e) => setDropdownActive(false)}
          ></div>
        )}
        {dropdownActive && (
          <div className="toolbar-menu-box">
            <div
              className="toolbar-menu-box-item"
              onClick={(e) => {
                setDropdownActive(false);
              }}
            >
              <Link className="toolbar-menu-box-item-title" to="/account">
                Account Info
              </Link>
            </div>
            <div
              className="toolbar-menu-box-item"
              onClick={(e) => {
                logoutUser();
                setDropdownActive(false);
              }}
            >
              <span className="toolbar-menu-box-item-title">Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
