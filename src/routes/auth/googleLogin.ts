import passport, { DoneCallback } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { checkIfUserExists, createUser, getUser } from "../../db/auth";
import { deserialize, serialize } from "../../utils/authUtils";
const googleClientID: any = process.env.OAUTH_CLIENT_ID;
const googleClientSecret: any = process.env.OAUTH_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:8000/auth/google/callback",
      scope: ["profile", "email"],
      state: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      const userdata = {
        username: profile.displayName,
        email: profile?.emails?.[0]?.value,
      };
      if (!userdata.email) {
        done(
          new Error(
            "The google account you used for authentication does not have an email available, the sign up/login failed"
          )
        );
      } else {
        const userAlreadyExists = await checkIfUserExists(userdata.email);
        let user;
        if (userAlreadyExists) {
          user = await getUser(userdata.email);
        } else {
          user = await createUser({ email: userdata.email }, "google");
        }
        const userToReturn = {
          username: user?.dataValues?.user_name,
          email: user?.dataValues?.email,
          role: user?.dataValues?.role,
        };
        done(null, userToReturn);
      }
    }
  )
);

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

export default passport;
