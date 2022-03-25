var express = require('express');
var axios = require('axios')
var router = express.Router();



router.get('/inserir',function(req,res,next){
  res.render('forms',{})
});


/* GET users listing. */
router.get('/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas/"+req.params.id)
      .then(resp =>{
        var musica = resp.data
        res.render('musica',{musica:musica})
      })
      .catch(function(erro){
        res.render('error', { error: erro });
  
    })

});

router.get('/prov/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?prov="+req.params.id)
      .then(resp =>{
        var provs = resp.data
        res.render('provs',{provs:provs,p : req.params.id})
      })
      .catch(function(erro){
        res.render('error', { error: erro });
  
    })

});


router.post('/',function(req,res,next){
  axios.post("http://localhost:3000/musicas",{
    "id":req.body.id,
    "tit":req.body.tit,
    "prov":req.body.prov
  })
      .then(res.redirect('/'))
      .catch(function(erro){
        res.render('error', { error: erro });
})
});


module.exports = router;
