import React from 'react';
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import '../styles/invoice.css';

export default function TourInvoice(props) {

  const first_name = ReactSession.get("first_name");
  const last_name = ReactSession.get("last_name");
  const tour_type = ReactSession.get("tour_name");
  const peoplecount = ReactSession.get("tour_no_of_people");
  const tour_price= ReactSession.get("tour_price");
  const booking_id= ReactSession.get("tour_booking_number");
  
  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <section>
        <div className="container-box-view">
          <div className="centre-box">
            <nav className="titlevalue">Invoice Generated</nav>
            <br></br>
            <br></br>
            <nav className="content">
              <form >
                <nav className="userdata">
                  <nav className="inputvalue19">                    
                    <h3 className="inputdetails">FirstName: <strong>{first_name}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">LastName: <strong>{last_name}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Booking ID: <strong>{booking_id}</strong></h3>
                   
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Tour type: <strong>{tour_type}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">No of people: <strong>{peoplecount}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Total Price: <strong>{tour_price}</strong></h3>
                   
                  </nav>
                  
                </nav>
              </form>
            </nav>
          </div>
          <nav>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        
        <nav className="buttonContainer">
          <Link to='/feedback'>
            <button className='button-body2' id='submitbutton'> Provide Feedback</button>
          </Link>
        </nav>
        <br></br>
        <br></br>
        <nav className="buttonContainer">
          <Link to='/home'>
            <button className='button-body2' id='submitbutton'> Tour Suggestion</button>
          </Link>
        </nav>
      </nav>
        </div>
      </section>

      
    </>

  );
}
