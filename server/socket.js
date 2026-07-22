let io;

const initSocket = (server) => {
    io = server;
}

const getIo = () => {
    if(!(io)){
        throw new Error("Socket.io is not initialized.");
    }
    return io;
};

module.exports ={
    initSocket,
    getIo
}