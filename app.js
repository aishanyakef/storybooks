const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

// Load Local Modules
const auth = require('./routes/auth');
const index = require('./routes/index');
const keys = require('./config/keys');
require('./models/User');
require('./config/passport')(passport);

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
   useMongoClient: true
})
   .then(() => console.log('MongoDB Connected'))
   .catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
   }));

app.set('view engine', 'handlebars');

// Cookie Parser Middleware
app.use(cookieParser());

// Passport Session Middleware
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next) => {
   res.locals.user = req.user || null;
   next();
});

// Use Routes
app.use('/auth', auth);
app.use('/', index);


const port = process.env.PORT || 5000;


app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});


