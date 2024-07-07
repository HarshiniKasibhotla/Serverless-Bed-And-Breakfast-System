import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Navbar from "./components/Navbar";
import MealOrder from "./pages/MealOrder";
import RoomBook from "./pages/RoomBook";
import TourPlan from "./pages/TourPlan";
import FeedbackComponent from "./components/FeedbackComponent";
import FoodInvoice from "./pages/FoodInvoice";
import RoomInvoice from "./pages/RoomInvoice";
import Login from "./pages/Login";
import SQA from "./pages/SQA";
import Cipher from "./pages/Cipher";
import Reg from "./pages/Reg";
import ShowDetails from "./pages/Visualization/vis";
import Logout from "./pages/Logout";
import FeedBack from "./pages/FeedBack";
import TourInvoice from "./pages/TourInvoice";
import AdminHome from "./Admin/AdminHome";

export default function RoutingConfig(props) {
  return (
    <Router>
      <Navbar>
        <Routes>
          <Route exact path="/" element={<App />}></Route>
          <Route exact path="/roombook" element={<RoomBook />}></Route>
          <Route exact path="/meals" element={<MealOrder />}></Route>
          <Route exact path="/tours" element={<TourPlan />}></Route>
          <Route exact path="/register" element={<Reg />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/securityqna" element={<SQA />}></Route>
          <Route exact path="/ceasercipher" element={<Cipher />}></Route>
          <Route exact path="/feedback" element={<FeedBack />}></Route>
          <Route exact path="/foodinvoice/:id" element={<FoodInvoice />}></Route>
          <Route exact path="/roominvoice" element={<RoomInvoice />}></Route>
          <Route exact path="/admin/showVisual" element={<ShowDetails />}></Route>
          <Route exact path="/logout" element={<Logout />}></Route>
          <Route exact path="/feedbackcomponent" element={<FeedbackComponent/>}></Route>
          <Route exact path="/tourinvoice" element={<TourInvoice />}></Route>
          <Route exact path="/adminHome" element={<AdminHome />}></Route>
        
        </Routes>
      </Navbar>
    </Router>
  );
}
