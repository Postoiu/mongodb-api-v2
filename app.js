const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');

const homeRouter = require('./routes/home.js');
const loginRouter = require('./routes/login.js');
const { closeConnection } = require('./util/mongodb-util.js');

const app = express();


// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.redirect('/home');
})

app.use('/home', homeRouter);
app.use('/login', loginRouter);


app.get('/logout', (req, res, next) => {
  res.clearCookie('accessToken');
  res.clearCookie('user');
  closeConnection();
  res.redirect('/login');
})

// app.use(errorhandler({log: renderError}));

// function renderError(err, str, req, res) {
//   res.render('error', {message: str, error: err});
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(res.headersSent) {
    return next(err);
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);