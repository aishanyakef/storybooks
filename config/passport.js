const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const User = mongoose.model('users');

module.exports = function (passport) {
   passport.use(
      new GoogleStrategy({
         clientID: keys.googleClientID,
         clientSecret: keys.googleClientSecret,
         callbackURL: '/auth/google/callback',
         proxy: true
      }, (accessToken, refreshToken, profile, done) => {
         const image = profile.photos[0].value.substr(0, profile.photos[0].value.indexOf('?'));
         const newUser = {
            googleID: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: image
         };

         // Check for existing user
         User.findOne({
            googleID: profile.id
         }).then(user => {
            if (user) {
               // Return user
               done(null, user);
               // Create user
            } else {
               new User(newUser)
                  .save()
                  .then(user => done(null, user));
            }
         })
      })
   );

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });
   passport.deserializeUser((id, done) => {
      User.findById(id).then(user => done(null, user));
   });



};