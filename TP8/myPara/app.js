var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cors = require('cors')


var indexRouter = require('./routes/index');

var app = express();
var mongoose = require('mongoose')

var mongodb = 'mongodb://127.0.0.1/paras'
mongoose.connect(mongodb,{useNewUrlParser:true,useUnifiedTopology:true})

var db = mongoose.connection
db.on('error',err => console.log("Erro de conexão ao MongoDB..."))
db.once('open',function(){
  console.log("Conexão ao Mongo bem sucedida")
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())
app.use('/paras', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
});

module.exports = app;
