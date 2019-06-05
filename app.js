var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

// app.use('/', indexRouter);
app.use('/login',indexRouter.getLogin);
app.use('/resetPass',indexRouter.resetPass);
app.use('/changeStock',indexRouter.changeStock);
app.use('/lerEventos',indexRouter.lerEventos);
app.use('/lerMateriais',indexRouter.lerMateriais);
app.use('/lerOcorrencias',indexRouter.lerOcorrencias);
app.use('/criarOcorrencia',indexRouter.criarOcorrencia);
app.use('/criarMaterial',indexRouter.criarMaterial);
app.use('/updateMaterial',indexRouter.updateMaterial);
app.use('/registarEntradaSaida',indexRouter.registarEntradaSaida);
app.use('/lerChaves',indexRouter.lerChaves);
app.use('/lerBlocos',indexRouter.lerBlocos);
app.use('/lerPisos',indexRouter.lerPisos);
app.use('/criarChave',indexRouter.criarChave);
app.use('/updateChave',indexRouter.updateChave);

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

module.exports = app;
