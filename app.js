var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signinRouter = require('./routes/signin');
var postRouter = require('./routes/post');
var formdemoRouter = require('./routes/formdemo');
var session = require("express-session");
var bodyParser = require("body-parser");
var User = require( './models/user' );
var flash = require('connect-flash');

const mongoose = require('mongoose');


const postController = require('./controllers/postController')
const formController = require('./controllers/formController')

const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)



var app = express();

mongoose.connect( 'mongodb://localhost/postBase' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));




app.use(express.static(path.join(__dirname, 'public')));

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})


app.use((req,res,next) => {
  console.log("middleware to set loggedIn is being run")
  console.log(req.user)
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    res.redirect('/post');
    if (req.user){
      if (req.user.googleemail=='tjhickey@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'teacher'
      } else {
        console.log('student has logged in')
        res.locals.status = 'student'
      }
    }
  }
  next()
})



// route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/signin');
    }
}

// we require them to be logged in to see their profile
app.get('/userInfo', function(req, res) {
        res.render('userInfo', {
            user : req.user // get the user out of session and pass to template
        });
    });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signIn', signinRouter);
//app.use('/formdemo', formdemoRouter);
//app.use('/post', postRouter);

app.get('/formdemo', formController.getAllPosts );
app.post('/deletePost', formController.deletePost );
app.get('/post',postController.getAllPosts );
app.post('/savePost', postController.savePost );
app.post('/deletePost', postController.deletePost );



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.get('/loginerror', function(req,res){
//   res.render('loginerror',{})
// })
//
// app.get('/login', function(req,res){
//   res.render('login',{})
// })
//
// // we require them to be logged in to see their profile
// app.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile', {
//             user : req.user // get the user out of session and pass to template
//         });
//     });
//
// // route for logging out
// app.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });
//
//
// app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
//
// // the callback after google has authenticated the user
// app.get('/auth/google/callback',
//         passport.authenticate('google', {
//                 successRedirect : '/profile',
//                 failureRedirect : '/loginerror'
//         }));
//
// app.get('/login/authorized',
//         passport.authenticate('google', {
//                 successRedirect : '/profile',
//                 failureRedirect : '/loginerror'
//         }));
//
//         function isLoggedIn(req, res, next) {
//             console.log("checking to see if they are authenticated!")
//             // if user is authenticated in the session, carry on
//             if (req.isAuthenticated()){
//               console.log("user has been Authenticated")
//               return next();
//             }
//
//             console.log("user has not been authenticated...")
//             // if they aren't redirect them to the home page
//             res.redirect('/login');




module.exports = app;
