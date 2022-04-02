var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs')
var upload = multer({dest:'uploads'})
var File = require('../controllers/file')



/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0,16)
  File.list()
    .then(f =>{
      res.render('index', {
        date:d,
        file:f
      });

    })
});


router.get('/inserir',(req,res)=>{
  res.render('inserir',{})
})


router.post('/files', upload.single('file'),(req,res)=>{
  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../fileStore' + '/'+req.file.originalname

  fs.rename(oldPath,newPath,erro => {
    if(erro) throw erro
  })

  var d = new Date().toISOString().substring(0,16)


  var f = {
    date: d,
    file:req.file.originalname,
    size:req.file.size,
    desc: req.body.desc,
    type : req.file.mimetype
  }

  File.insert(f)
      .then(_ => res.redirect('/'))
      .catch(erro=>console.log(erro))

})


router.post('/apagar/:id',(req,res)=> {
  File.delete(req.params.id)
      .then(_ =>{
          var filePath = __dirname + '/../fileStore/'+ req.params.id
          fs.unlink(filePath, err=>{
            if(err){
              console.log(err)
            }
          })
          res.redirect('/')
      })
      .catch(err=>console.log(err))
})

router.post('/download/:id',(req,res)=>{
  var filePath = __dirname + '/../fileStore/'+ req.params.id
  res.download(filePath,function (err) {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err); // non-404 error
    // file for download not found
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
})


module.exports = router;
