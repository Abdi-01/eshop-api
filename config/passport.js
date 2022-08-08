const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const GOOGLE_CLIENT_ID = process.env.GCLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GCLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("PROFILE from google ✅", profile);

        return done(null, profile);
    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, done) => {
    console.log('SerializeUser', user);
    done(null, user);
})

passport.deserializeUser((obj, done) => {
    console.log('DESerializeUser', obj);
    done(null, obj);
})