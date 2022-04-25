var express = require('express');
var router = express.Router();
var Para = require('../controllers/para')

/* GET home page. */
router.get('/', function(req, res) {
  Para.listar()
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(err => {
      res.status(500).jsonp({erro:err})
    })
});


router.post('/', function(req, res) {
  Para.inserir(req.body)
    .then(dados => {
      res.status(201).jsonp(dados)
    })
    .catch(err => {
      res.status(501).jsonp({erro:err})
      console.log("erro")
    })
});

router.put('/editar/:id', function(req, res) {
  Para.editar(req.params.id,req.body)
    .then(function() {
      res.status(202).jsonp(req.params.id)
  })
  .catch(function(err) {
      res.status(502).jsonp({ error:err.message })
  })
});


router.delete('/delete/:id', function(req, res) {
  Para.delete(req.params.id)
    .then(function() {
      res.status(202).jsonp(req.params.id)
  })
  .catch(function(err) {
      res.status(502).jsonp({ error:err.message })
  })
});


module.exports = router;
