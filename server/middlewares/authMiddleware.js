const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization
        console.log(authHeader);
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            console.log("Error in authHeader");
            return res.status(401).json({message: "No token. Authentication denied."})
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            console.log("Error in token if ")
            return res.status(401).json({message: "Token missing"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {_id : decoded._id || decoded.userId || decoded.id};
        next();
    }catch(err){
        console.error("Auth middleware error", err.message);
        return res.status(401).json({message : "Token is not valid"});
    }
}

module.exports = auth;