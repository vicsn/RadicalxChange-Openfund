import React, { useContext } from "react";
import "./HomeTopBar.scss";
import { StateContext } from "../../hooks";
// import { Search } from "react-feather";
function HomeTopBar() {
  // const { searchBusinesses } = useContext(ActionContext);
  const { roundDetails } = useContext(StateContext);  

  return (
    <div className="home-top-bar">
      {/* <div className="app-icon-container">
        <img src={require("../../assets/app-icon.svg")} alt="app-icon" />
      </div> */}
      <h1 className="home-head-line">RadicalxChange Open Fund</h1>
      {roundDetails.round_status === "Ongoing" ? (
        <div className="bottom-margin-set">
          <h4 className="home-tag-line-1">Current $15k RxC Apps round live now</h4>
          <h5 className="home-tag-line-1">
            Contribute to these projects by the 10th of December to get your
            contribution Matched!
          </h5>
        </div>
      ) : (
        <p className="home-tag-line bottom-margin-set">
          <span role="img" aria-label="tada">
            🎉
          </span>{" "}
          <i>Important Note</i>: Round 1 of the RadicalxChange Openfund has closed! Thank
          you for your support!!{" "}
          <span role="img" aria-label="tada">
            🎉
          </span>
        </p>
      )}
      {/* <div className="list-action-container">
        <div className="home-search-container">
          <Search></Search>
          <input
            type="search"
            className="search-input"
            placeholder="Quick Search"
            value={searchText}
            onChange={(e) => searchBusinesses(e.target.value, backupBusinesses)}
          />
        </div> */}
      {/* <div className="home-sort-container">
          <span>Sort By:</span>
          <div className="home-sort-value">
            <span>Least Funded</span>
            <ChevronDown></ChevronDown>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default HomeTopBar;
