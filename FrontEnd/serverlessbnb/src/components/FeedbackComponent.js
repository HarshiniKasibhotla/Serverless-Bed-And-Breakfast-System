import React, { useEffect, useState } from "react";
import "../styles/feedbackComponent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackComponent() {
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  let navigate = useNavigate();

  const getFeedbacks = () => {
    setPercentages({
      food: parseInt(data[9]),
      room: parseInt(data[10]),
      tour: parseInt(data[11]),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let { data: response } = await axios.get(
          "https://jaiutinmo3zu7o7sgai77fqgse0opgco.lambda-url.us-east-1.on.aws/"
        );
        console.log(response);
        response = response.split(",");
        setData(response);
        console.log(parseInt(data[9]), data[10], data[11]);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
    getFeedbacks();
  }, []);

  return (
    <div className="Feedback">
      <div className="FeedbackItem">
        <div className="FeedbackProgress">
          <div className="FeedbackPercentage" style={{ width: `${data[9]}%` }}>
            {parseInt(data[9])}%
          </div>
        </div>
        <p>Food service</p>
      </div>
      <div className="FeedbackItem">
        <div className="FeedbackProgress">
          <div className="FeedbackPercentage" style={{ width: `${data[10]}%` }}>
            {data[10]}%
          </div>
        </div>
        <p>Room service</p>
      </div>
      <div className="FeedbackItem">
        <div className="FeedbackProgress">
          <div className="FeedbackPercentage" style={{ width: `${data[11]}%` }}>
            {data[11]}%
          </div>
        </div>
        <p>Tour service</p>
      </div>
    </div>
  );
}
