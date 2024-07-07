import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";
import "../styles/invoice.css";
import axios from "axios";
export default function AdminHome(props) {
  //jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/getreport
  const [reportUrl, setReportUrl] = useState("");
  useEffect(() => {
    axios
      .get(
        "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/getreport"
      )
      .then((res) => setReportUrl(res.data.url))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <nav className="buttonContainer">
        <Link to="/admin/showVisual">
          <button className="button-body2" id="submitbutton">
            {" "}
            Analytics
          </button>
        </Link>
      </nav>
      <br></br>
      <br></br>
      <nav className="buttonContainer">
        <a href={reportUrl}>
          <button className="button-body2" id="submitbutton">
            {" "}
            Generate report
          </button>
        </a>
      </nav>
    </>
  );
}
