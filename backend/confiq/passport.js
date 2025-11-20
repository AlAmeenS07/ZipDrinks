import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import 'dotenv/config'
import userModel from "../models/userModel.js"
import walletModel from "../models/wallet.js";
import { SIX_DIGIT_MIN_VALUE, SIX_DIGIT_RANGE_VALUE } from "../utils/constants.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                user = await userModel.findOne({ email: profile.emails[0].value });

                if (user) {
                    return done(null, false, { message: 'Email already exists' });
                }

                const generateReferralCode = async () => {
                    let refCode;
                    let exist = true

                    while (exist) {
                        const num = Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE);
                        refCode = `REF${num}`;

                        let referralExist = await userModel.findOne({ referralCode: refCode })
                        if (!referralExist) {
                            exist = false
                        }
                    }

                    return refCode
                };

                let referralCode = await generateReferralCode()

                user = new userModel({
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isVerified: true,
                    referralCode
                });
                await user.save();

                await walletModel.create({ userId : user._id})

                return done(null, user);
            }
        } catch (error) {
            return done(error, null)
        }
    }
));

export default passport;