import React from 'react';
import { Link } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import '../styles/invoice.css';
import LexBot from '../components/LexBot';
import dateFormat from 'dateformat';

export default function RoomInvoice(props) {

  
  const first_name = ReactSession.get("first_name");
  const last_name = ReactSession.get("last_name");
  const room_number = ReactSession.get("room_number");
  const people_count = ReactSession.get("r_people_count");
  const price= ReactSession.get("r_price");
  const booking_id= ReactSession.get("r_booking_id");
  const checkinDate = ReactSession.get("checkinDate");
  const checkoutDate = ReactSession.get("checkoutDate");

   const checkinDate1 = dateFormat(checkinDate, "mmmm dS, yyyy");
   const checkoutDate1 = dateFormat(checkoutDate, "mmmm dS, yyyy");
  

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
                  <h3 className="inputdetails">Room Number: <strong>{room_number}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">No of people: <strong>{people_count}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Total Price: <strong>{price}</strong></h3>
                   
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Checkin Date: <strong>{checkinDate1}</strong></h3>
                    
                  </nav>
                  <nav className="inputvalue19">
                  <h3 className="inputdetails">Checkout Date: <strong>{checkoutDate1}</strong></h3>
                   
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
          <Link to='/tours'>
            <button className='button-body2' id='submitbutton'> Tour Suggestion</button>
          </Link>
        </nav>
      </nav>
        </div>
      </section>

    <LexBot/> 
    </>

  );
}
