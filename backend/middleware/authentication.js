import jwt from "jsonwebtoken";
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
      const verified = verify(token, process.env.SECRET_KEY);
      const role = verified.role;

      // Check if the user's role allows access based on hierarchy
      if (
        roleHierarchy[role] >= roleHierarchy[requiredRole] &&
        !(role !== "Customer" && requiredRole === "Customer") // Managers and Admins can't access customer routes
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

export default authenticateToken;