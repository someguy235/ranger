const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/model").UserModel;

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_AUTH_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      passReqToCallback: true,
    },
    async (req, token, done) => {
      const exp = new Date(token.exp * 1000);
      const now = new Date();
      console.log(now > exp);

      console.log(req.cookies);

      // TODO: try to refresh auth token, otherwise 401
      // TODO: also return new auth token

      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// passport.use(
//   "signup",
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         const user = await UserModel.create({ email, password });
//         return done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// TODO: also return refresh token
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("passport.use:login");
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
