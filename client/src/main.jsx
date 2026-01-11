import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import { SocketProvider } from "./context/socketContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { GeneralContextProvider } from "./context/generalContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketProvider>
          <GeneralContextProvider>
            <Navbar />
            <App />
          </GeneralContextProvider>
        </SocketProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
