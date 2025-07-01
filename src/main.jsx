import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.scss'

import { CarritoProvider, ModalCarritoProvider } from "./components/carrito/CarritoContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <ModalCarritoProvider>
          <App />
        </ModalCarritoProvider>
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
