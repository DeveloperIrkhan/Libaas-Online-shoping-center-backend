import { userRoleEnums } from "../enums/userRoles.js";
import { User } from "../models/user.model.js";

export const IsAdmin = async (req, resp, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.UserRole !== userRoleEnums.ADMIN) {
      return resp.status(401).send({
        success: false,
        message: "un-autherized user, please login as admin"
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return resp.status(401).send({
      success: false,
      message: "error in meddleware",
      error
    });
  }
};
