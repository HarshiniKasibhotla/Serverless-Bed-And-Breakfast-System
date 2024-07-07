//Author: amankumar Manojkumar Patel || BannerId: B00888136


import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { useParams } from "react-router-dom";
import { Chart } from "react-google-charts";



const Showfeedback = () => {


    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const itemId = useParams();

     const data1 = [
        ['Service', 'Positive', 'Negative'],
              ['Food', parseInt(data[3]), parseInt(data[4])],
              ['Room', parseInt(data[5]), parseInt(data[6])],
              ['Tour', parseInt(data[7]), parseInt(data[8])]
    ];
    
     const options1 = {
        title: "Customer Satisfaction chart",
        chartArea: { width: "50%" },
        hAxis: {
            title: "Number of reviews",
            minValue: 0,
        },
        vAxis: {
            title: "Services",
        },
    };
     function App1() {
        return (
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={data1}
            options={options1}
          />
        );
      }




      const data2 = [
        ['Service', 'Number of Orders'],
          ['Food',     parseInt(data[0])],
          ['Room',      parseInt(data[1])],
          ['Tour',  parseInt(data[2])],
      ];
      var tot = parseInt(data[0])+parseInt(data[1])+parseInt(data[2]);
      const options2 = {
        title: "Total reviews given by any user: "+ tot ,
        pieHole: 0.4,
        is3D: false,
      };

      function App2() {
        return (
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={data2}
            options={options2}
          />
        );
      }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                let { data: response } = await axios.get("https://jaiutinmo3zu7o7sgai77fqgse0opgco.lambda-url.us-east-1.on.aws/");
                console.log(response);
                response = response.split(',');
                setData(response);
                console.log(response);
            } catch (error) {
                console.error(error.message);
            }
            setLoading(false);
        }

        fetchData();
    }, []);
    return (
        <Fragment>
            <div>
                <div className='all'>
                    <h1 className='head'>Given Feedbacks</h1>
                    <p className='pmid text-center'>Here you can lookout the Feedbacks of the User.</p>
                </div>
                {App1()}
                {App2()}

            </div>
        </Fragment>
    )
}

export default Showfeedback;