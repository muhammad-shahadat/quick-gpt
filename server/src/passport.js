import passport from "passport";
import { Strategy as  JwtStrategy } from "passport-jwt";

import User from "./models/User.js";



const opts = {}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.accessToken;
    }
    return token;
};

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_ACCESS_KEY;

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {

        const user = await User.findById(jwtPayload.id).select("-password");

        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }

}));

export default passport;