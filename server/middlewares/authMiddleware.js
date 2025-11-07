const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No token. Authentication denied."})
        }

        const token = authHeader.splits(" ")[1];

        if(!token){
            return res.status(401).json({message: "Token missing"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.user = {id : decoded._id || decoded.userId || decoded.id};
        next();
    }catch(err){
        console.error("Auth middleware error", err.message);
        return res.status(401).json({message : "Token is not valid"});
    }
}

module.exports = auth;