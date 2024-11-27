import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/AuthSchema.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserModel.findOne({
          googleId: profile.id,
        }).exec();

        if (existingUser) {
          return done(null, { ...existingUser.toObject(), token: accessToken });
        }

        const newUser = new UserModel({
          googleId: profile.id,
          name: profile.name?.givenName,
        
          email: profile.emails?.[0].value,
        });

        await newUser.save();
        done(null, { ...newUser.toObject(), token: accessToken });
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
