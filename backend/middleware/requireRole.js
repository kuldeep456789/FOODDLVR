import userModel from "../models/userModel.js";

const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const tokenRole = req.user?.role;
      if (tokenRole && allowedRoles.includes(tokenRole)) {
        return next();
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication is required before checking roles.",
        });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access this resource.",
        });
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Role check failed" });
    }
  };
};

export default requireRole;
