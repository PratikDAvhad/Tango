import React, {useEffect, useState, useRef} from "react";
import api from "../api/axiosConfig";
import {useSocket} from "../context/socketContext";

export const ChatWindow = ({selectedUser, currentUser}) => {
    const [chatMessages, setChatMessages] = useState([]);
    const socket = useSocket();
    const endRef = useRef();

    useEffect(() => {
        if(!selectedUser) return;
        const fetchMessages = async () => {
            // try{
            //     const {data} = await api.get(`/messages/`)
            // }
        }
    })
}