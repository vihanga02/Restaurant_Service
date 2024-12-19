const jwt = require("jsonwebtoken");
const { verify } = jwt;

const roleHierarchy = {
  Admin: 2,
  Customer: 1,
};

const authenticateToken = (requiredRole) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY || "your_secret_key");
      const role = verified.role;

      if (
        roleHierarchy[role] >= roleHierarchy[requiredRole] &&
        !(role !== "Customer" && requiredRole === "Customer") 
      ) {
        req.user = verified;
        next();
      } else {
        res.status(403).json({ message: "Forbidden" });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = authenticateToken;