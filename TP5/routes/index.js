const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/','/musicas'], function(req, res, next) {

  axios.get("http://localhost:3000/musicas")
      .then(resp =>{
        var musicas = resp.data
        res.render('musicas',{musicas: musicas})
      })
      .catch(function(erro){
        res.render('error', { error: erro });
  
    })
});

module.exports = router;
