import "../styles/home.css";
import { AppProvider } from "../AppContext";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import Title from "../components/Title";
import FeedbackComponent from "../components/FeedbackComponent";
import Menu from "../components/Menu";
import React, { useEffect } from "react";

function Home() {
  let navigate = useNavigate();
  // const userId = ReactSession.get("user_id");

  // useEffect(() => {
  //   if (!userId) navigate("/loginpage");
  // });

  return (
    <React.Fragment>
      <AppProvider>
        <Title />
        <div className="App">
          <Menu />
          <div className="Suggestions">
            <FeedbackComponent />
            <div className="Recommendation"> Tour Recommendation</div>
          </div>
        </div>
      </AppProvider>
    </React.Fragment>
  );
}

export default Home;
