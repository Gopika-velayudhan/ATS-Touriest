
import User from "../model/AuthSchema.js";
import Jwt from "jsonwebtoken";



export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = Jwt.sign(
        { email: email },
        process.env.ADMIN_ACCESS_TOKEN_SECRT
      );
      return res.status(200).send({
        statusCode: 200,
        message: "Admin Login Successful",
        data: token,
      });
    } else {
      return res.status(404).send({
        statusCode:404,
        message: "Admin not found",
        data: null,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

export const allUser = async (req, res, next) => {
  try {
    const allUser = await User.find();
    const allUserCount = await User.countDocuments();

    if (allUser.length === 0) {
      return res.status(404).json({
        statusCode:404,
        message:"user not found",
        data:null
      })
    } else {
      res.status(200).json({
        statusCode: 200,
        message: "successfully fetched all user",

        data: allUser,
        dataCount: allUserCount,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};


export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            statusCode:404,
            message:"user not found",
            data:null
          })
      
    }
    res.status(200).json({
      statusCode: 200,
      message: "successfully fetched user",
      data: user,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

export const blockuser = async (req, res) => {
  try {
    const userId = req.params.id;
    const action = req.query.action;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({statusCode:404, message: "User not found",data:null });
    }

    if (action === "block" && user.isBlocked) {
      return res.status(400).json({statusCode:400, message: "User is already blocked",data:null });
    } else if (action === "unblock" && !user.isBlocked) {
      return res.status(400).json({statusCode:400, message: "User is not blocked",data:null });
    }

    user.isBlocked = action === "block";
    await user.save();

    const actionMessage = action === "block" ? "blocked" : "unblocked";
    res
      .status(200)
      .json({statusCode:200, message: `User ${actionMessage} successfully`, data:user });
  } catch (err) {
    return res
    .status(500)
    .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};
