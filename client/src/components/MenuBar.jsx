import { useState, useContext } from "react";
import { MenuItem } from "./MenuItem";
import { useNavigate } from "react-router-dom";

import { GeneralContext } from "../context/generalContext";
export const MenuBar = () => {
  const { menu, activePage, setActivePage } = useContext(GeneralContext);

  const navigate = useNavigate();

  return (
    <div
      style={{
        // backgroundColor: "#D3D3D3 ",
        // height: "100vh",
        // width: "40px",
        // zIndex: 12,
        // position: "fixed",
        // width: "60px",
        // background: "#D3D3D3",
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "space-between",

        width: menu ? "45px" : "180px",
        background: "#D3D3D3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div className="d-flex flex-column justify-content-start p-2 h-50">
        <p
          onClick={() => {navigate("/chats"), setActivePage("chats")}}
          style={{
            cursor: "pointer",
            fontWeight: activePage === "chats" ? "bold" : "normal",
            background: activePage === "chats" ? "#999898" : "#D3D3D3"
          }}
        >
          <i class="fa-brands fa-whatsapp fa-lg"></i>
          {!menu && " Chats"}
        </p>
        <p
          onClick={() => {navigate("/stories"), setActivePage("stories")}}
          style={{
            cursor: "pointer",
            fontWeight: activePage === "stories" ? "bold" : "normal",
            background: activePage === "stories" ? "#999898" : "#D3D3D3"
          }}
        >
          <i class="fa-brands fa-flickr fa-lg"></i> {!menu && " Stories"}
        </p>
        <p
          onClick={() => {navigate("/ai"), setActivePage("ai")}}
          style={{
            cursor: "pointer",
            fontWeight: activePage === "ai" ? "bold" : "normal",
            background: activePage === "ai" ? "#999898" : "#D3D3D3"
          }}
        >
          <i class="fa-brands fa-bilibili fa-lg"></i> {!menu && " Tango Ai"}
        </p>
      </div>

      <hr></hr>
      <div className="d-flex flex-column justify-content-start p-2 h-50">
        <p
          onClick={() => {navigate("/profile"), setActivePage("profile")}}
          style={{
            cursor: "pointer",
            fontWeight: activePage === "profile" ? "bold" : "normal",
            background: activePage === "profile" ? "#999898" : "#D3D3D3"
          }}
        >
          <i className="fa-solid fa-circle-user fa-lg "></i>{" "}
          {!menu && " Profile"}
        </p>
      </div>
    </div>
  );
};
