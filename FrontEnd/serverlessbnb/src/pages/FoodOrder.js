import React, { useState } from "react";
import "../styles/Register.css";
import "../styles/LoginPage.css";
import "../styles/Feedback.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ReactSession } from "react-client-session";
import { toast } from "react-toastify";
import LexBot from "../components/LexBot";

export default function FoodOrder(props) {
  const [disablebutton, setdisablebutton] = useState(false);

  let navigate = useNavigate();

  const [fooditem, setfooditemValue] = useState({
    value: "default",
    validinput: false,
  });
  const [price] = useState({
    value: "default",
    validinput: false,
  });
  const [itemcount, setitemcountValue] = useState({
    value: "",
    validinput: false,
    error: [],
  });

  function isAllInputValid() {
    return itemcount.validinput && fooditem.validinput;
  }

  function validateitemcount(itemcount) {
    if (itemcount.match(/^[0-9]/) && itemcount <= 100 && itemcount != 0) {
      return true;
    }
  }

  ReactSession.setStoreType("localStorage");
  const user_id = ReactSession.get("user_id");

  const handleSubmit = (event) => {
    event.preventDefault();
    setdisablebutton(true);
    if (isAllInputValid()) {
      const user = {
        user_id: user_id,
        food_item: fooditem.value,
        item_count: itemcount.value,
      };

      ReactSession.set("food_item", fooditem.value);
      ReactSession.set("item_count", itemcount.value);
      ReactSession.set("f_price", price.value);

      

      //Make a API call to backend to order the Food to the application
      const url = "";
      axios
        .post(url, user)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            toast.success(response.data.message);
            ReactSession.set("order_id", response.data.order_id);
            navigate("/foodinvoice");
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error("something went wrong please try again!");
          }
        });
    }
    setdisablebutton(false);
  };

  const handleChange = (event) => {
    let itemcountStateValue = itemcount;
    let fooditemStateValue = fooditem;

    const err = [];
    const { name, value } = event.target;

    switch (name) {
      case "fooditem":
        fooditemStateValue.value = value;
        console.log(fooditemStateValue.value);
        fooditemStateValue.validinput = true;
        break;

      case "itemcount":
        itemcountStateValue.value = value;

        if (!validateitemcount(value)) {
          itemcountStateValue.validinput = false;
          err.push(
            "No alphabets, 0 items not allowed, and the limit is 100 items"
          );
          itemcountStateValue.error = err;
          break;
        }
        itemcountStateValue.error = [];
        itemcountStateValue.validinput = true;
        break;

      default:
        break;
    }

    setfooditemValue((prevState) => ({
      ...prevState,
      value: fooditemStateValue.value,
      validinput: fooditemStateValue.validinput,
    }));

    setitemcountValue((prevState) => ({
      ...prevState,
      value: itemcountStateValue.value,
      validinput: itemcountStateValue.validinput,
      error: itemcountStateValue.error,
    }));
  };

  const getprice = (item, count) => {
    switch (item) {
      case "Sandwich":
        return count * 10;
      case "Fruit bowl":
        return count * 8;
      case "Pizza":
        return count * 15;
      case "Burritos":
        return count * 12;
      default:
        return 0;
    }
  };

  return (
    <>
      <Title />
      <nav className="containerform">
        <nav className="title">Food order Form</nav>
        <nav className="content">
          <form onSubmit={handleSubmit}>
            <nav className="userdata">
              <nav className="selectvalue">
                <label className="inputdetails">Food Items</label>
                <select
                  id="fooditem"
                  className="selection"
                  name="fooditem"
                  value={fooditem.value}
                  onChange={handleChange}
                >
                  <option value="DEFAULT">
                    Choose your item from the menu
                  </option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Fruit bowl">Fruit bowl</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burritos">Burritos</option>
                </select>
              </nav>
              <nav className="inputvalue">
                <label className="inputdetails">Food item count</label>
                <input
                  type="text"
                  name="itemcount"
                  value={itemcount.value}
                  onChange={handleChange}
                  id="itemcount"
                  placeholder="Enter your item count"
                />
                <label className="errorvalues">{itemcount.error.join()}</label>
              </nav>
              <nav className="inputvalue">
                <label className="inputdetails">Price</label>
                <input
                  type="text"
                  name="price"
                  value={getprice(fooditem.value, itemcount.value)}
                  onChange={handleChange}
                  id="price"
                  placeholder="Price of your item"
                  disabled
                />
              </nav>
              <nav className="buttonContainer">
                <button
                  className="button-body1"
                  id="submitbutton"
                  disabled={disablebutton}
                >
                  {" "}
                  Submit
                </button>
              </nav>
            </nav>
          </form>
        </nav>
      </nav>
    <LexBot/>
    </>
  );
}
