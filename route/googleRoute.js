
import express from "express";
import passport from "../utility/PassportConfig.js";

const googleRouter = express.Router();

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user 

    res.redirect(
      `${process.env.CLIENT_URL}/home?token=${user.token}&name=${user.name}`
    );
  }
);

export default googleRouter;
