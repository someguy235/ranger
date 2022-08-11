const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/model").UserModel;

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

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
      try {
        const exp = new Date(token.exp * 1000);
        const now = new Date();
        if (now > exp) {
          // check refresh token
          const user = await UserModel.findOne({ _id: token.user._id });
          const refresh = user.refresh;
          if (refresh) {
            const decode = jwt_decode(refresh);
            const rExp = new Date(decode.exp * 1000);
            if (rExp > now) {
              const newAuth = jwt.sign(
                { user: token.user },
                process.env.JWT_AUTH_SECRET,
                {
                  expiresIn: "5m",
                }
              );
              token.user.newAuth = newAuth;
            } else {
              const err = new Error("could not refresh auth token");
              err.status = 401;
              throw err;
            }
          }
        }

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
