const passport = require('passport');
const { dbQuery, dbConf } = require('./db');
const { hashPassword, createToken } = require('./encript');
const { transport } = require('./nodemailer');
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

        // register dari data profile
        // 1. Memeriksa apakah email tersebut terdaftar
        let userCheck = await dbQuery(`Select * from users Where 
        email=${dbConf.escape(profile.emails[0].value)};`)

        // 2. Jika tidak terdaftar, kita menyimpan data kedalam db mysql
        if (userCheck.length == 0) {
            let regis = await dbQuery(`INSERT INTO USERS (username, email, password ) 
            values (${dbConf.escape(profile.displayName)}, ${dbConf.escape(profile.emails[0].value)},  
            ${dbConf.escape(hashPassword(profile.id))});`)

            if (regis.insertId) {
                let sqlGet = await dbQuery(`Select iduser, email, status_id from users where iduser=${regis.insertId}`);

                // 3. membuat token
                let token = createToken({ ...sqlGet[0] }, '1h');

                // 4. Dikirimkan melalui email
                await transport.sendMail({
                    from: 'ESHOP ADMIN CARE',
                    to: sqlGet[0].email,
                    subject: 'Verification email account',
                    html: `<div>
                    <h3>Click link below</h3>
                    <a href="${process.env.FE_URL}/verification/${token}">Verified Account</a>
                    </div>`
                })
            }
        }



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