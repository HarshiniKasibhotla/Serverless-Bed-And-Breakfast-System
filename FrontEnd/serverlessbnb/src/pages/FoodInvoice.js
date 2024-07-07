import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import '../styles/invoice.css';
import { useParams } from 'react-router-dom';
import LexBot from '../components/LexBot';


export default function FoodInvoice(props) {

  let navigate = useNavigate();
  const u_id = useParams();
  console.log(u_id.id)

  const first_name = ReactSession.get("first_name");
  const last_name = ReactSession.get("last_name");
  const food_item = ReactSession.get("food_item");
  const item_count = ReactSession.get("item_count");
  const price= ReactSession.get("f_price");
  const order_id= ReactSession.get("order_id");


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
                  <nav className="inputvalue">                    
                    <h3 className="inputdetails">FirstName : <strong>{first_name}</strong></h3> 
                    
                  </nav>
                  <nav className="inputvalue">
                  <h3 className="inputdetails">LastName : <strong>{last_name}</strong></h3>
                  
                  </nav>
                  <nav className="inputvalue">
                  <h3 className="inputdetails">Order ID : <strong>{order_id}</strong></h3>
                  
                  </nav>
                  <nav className="inputvalue">
                  <h3 className="inputdetails">Food Item : <strong>{food_item}</strong></h3>
                   
                  <nav className="inputvalue">
                  <h3 className="inputdetails">Item Count : <strong>{item_count}</strong></h3>
                   
                  </nav>
                  <nav className="inputvalue">
                  <h3 className="inputdetails">Total Price: <strong>{price}</strong></h3>
                   </nav>
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
        <nav className="buttonContainer">
          <Link to='/home'>
            <button className='button-body2' id='submitbutton'> Checkout Ratings</button>
          </Link>
        </nav>

      </nav>
        </div>

        
       
      </section>

     <LexBot/> 
    </>

  );
}
