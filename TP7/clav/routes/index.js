var express = require('express');
var router = express.Router();
const axios = require('axios');
var fs = require('fs');
const apiKey = fs.readFileSync('./apiKey.txt',{encoding:'utf-8', flag:'r'})

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?nivel=1&apikey='+apiKey)
        .then(resp =>{
          var data = resp.data
          res.render('index', {data:data});
        })
        .catch(err=>{
          console.log(err)
        })
});


router.get('/classes/:cod', function(req, res, next) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + req.params.cod + '?apikey='+apiKey)
        .then(resp =>{
          var data = resp.data
          res.render('classe', {data:data});
        })
        .catch(err=>{
          console.log(err)
        })
});


module.exports = router;
