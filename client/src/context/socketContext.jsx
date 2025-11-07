import  {createContext, useContext, useEffect, useRef, } from "react";

const socketContext = createContext(null);

export const SocketProvider = ({children}) => {
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io("http://localhost:5000");
        return () => {
            socketRef.current.disconnect();
        }
    }, []);

    return (
        <socketContext.Provider value={socketRef.current} >
            {children};
        </socketContext.Provider>
    )
}

export const useSocket = () => useContext(socketContext);