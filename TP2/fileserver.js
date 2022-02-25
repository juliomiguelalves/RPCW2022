var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var myurl = req.url.substring(1)
    var m = url.parse(req.url, true).pathname
    console.log(m)
    if(m=="/filmes" || m=="/" || m=="/filmes/" ){
        fs.readFile('./index.html',function(err,data) {
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            if(err){
                res.write("<p>Erro na leitura de ficheiro...</p>")
            }
            else{
                res.write(data)
            }
            res.end()
        }
    )}
    else{
        fs.readFile('.'+m,function(err,data) {
            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
            if(err){
                res.write("<p>Erro na leitura de ficheiro...</p>")
            }
            else{
                res.write(data)
            }
            res.end()
    })
}

}).listen(7777)