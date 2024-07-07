import { ChakraProvider, theme } from "@chakra-ui/react";
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import RoutingConfig from "./RoutingConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import LexBotCommon from "./components/LexBotCommon";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RoutingConfig />
    </ChakraProvider>
    <ToastContainer />
    <LexBotCommon />
  </StrictMode>
);

serviceWorker.unregister();

reportWebVitals();
