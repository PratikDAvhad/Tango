import { useState, useContext } from "react";
import { MenuItem } from "./MenuItem";

import { GeneralContext } from "../context/generalContext";
export const MenuBar = () => {
  const { menu } = useContext(GeneralContext);

  return (
    <div
      style={{
        backgroundColor: "#D3D3D3 ",
        height: "100vh",
        width: "40px",
        zIndex: 12,
        position: "fixed",
      }}
    >
      <div className="d-flex flex-column align-items-center justify-content-start p-2 h-50">
        <p>
          <i className="fa-solid fa-message"></i>{!menu && 'Chats'}
        </p>
        <p>
          <i className="fa-solid fa-phone"></i> {!menu && 'Calls'}
        </p>
        <p>
          <i className="fa-regular fa-circle"></i> {!menu && "Tango Ai"}
        </p>
      </div>

      <hr></hr>
      <div className="d-flex flex-column align-items-center justify-content-start p-2 fs-5">
        <p>
          <i className="fa-solid fa-circle-user "></i>
        </p>
        <p>
          <i className="fa-solid fa-hexagon "></i>
        </p>
      </div>
    </div>
  );
};
