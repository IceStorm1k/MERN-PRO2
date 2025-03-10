import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if(token){
        try {
            const decoded = jwt.verify(token, "secret123");
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Can't access"
        })
    }
}