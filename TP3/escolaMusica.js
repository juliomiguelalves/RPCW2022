var http = require('http')
var url = require('url')
const axios = require('axios')
const { table } = require('console')



function generateMainPage(){
    page = "<body>Pesquisar por :"
    alunos = "<h1><a href=\"http://localhost:4000/alunos\"> Alunos</a> </h1>"
    instrumentos = "<h1><a href=\"http://localhost:4000/instrumentos\"> Instrumentos</a> </h1>"
    cursos = "<h1><a href=\"http://localhost:4000/cursos\"> Cursos</a> </h1>"

    return page +alunos + instrumentos + cursos +"</body>"
}


function generateTabelaAlunos(res){

      axios.get('http://localhost:3000/alunos')
            .then(function (resp) {
                a = resp.data
                a.forEach( al=>{
                    res.write("<tr>")
                    res.write("<td>"+al.id+"</td>");
                    res.write("<td>"+al.nome+"</td>");
                    res.write("<td>"+al.dataNasc+"</td>");
                    res.write("<td>"+al.curso+"</td>");
                    res.write("<td>"+al.anoCurso+"</td>");
                    res.write("<td>"+al.instrumento+"</td>");
                    res.write("</tr>")

                })
                res.write("</table>")
            })
            .catch( function (error) {
                console.log(error)
            })
            

}


function generateTabelaCursos(res){

    axios.get('http://localhost:3000/cursos')
          .then(function (resp) {
              c = resp.data
              c.forEach( cs=>{
                  res.write("<tr>")
                  res.write("<td>"+cs.id+"</td>");
                  res.write("<td>"+cs.designacao+"</td>");
                  res.write("<td>"+cs.duracao+"</td>");
                  res.write("<td>"+cs.instrumento["#text"]+"</td>");
                  res.write("</tr>")

              })
              res.write("</table>")
          })
          .catch( function (error) {
              console.log(error)
          })
          

}

function generateTabelaInstrumentos(res){

    axios.get('http://localhost:3000/instrumentos')
          .then(function (resp) {
              i = resp.data
              i.forEach( is=>{
                  res.write("<tr>")
                  res.write("<td>"+is.id+"</td>");
                  res.write("<td>"+is["#text"]+"</td>");
                  res.write("</tr>")

              })
              res.write("</table>")
          })
          .catch( function (error) {
              console.log(error)
          })
          
}





http.createServer(function (req,res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url,true).pathname
    if(myurl == "/"){
        var q = url.parse(req.url,true).query
        var resultado = parseInt(q.a) + parseInt(q.b)
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write(generateMainPage())
        res.end()
    }
    else if(myurl=="/alunos") {
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<h1>Tabela alunos</h1>")
        res.write(`<table class="table">
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data Nascimento</th>
            <th>Curso</th>
            <th>ANO curso</th>
            <th>Instrumento</th>
        </tr>
  `)
        generateTabelaAlunos(res)
    }
    else if(myurl=="/cursos"){
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<h1>Tabela Cursos</h1>")
        res.write(`<table class="table">
        <tr>
            <th>ID</th>
            <th>Designação</th>
            <th>Duração</th>
            <th>Instrumento</th>
        </tr>
  `)
        generateTabelaCursos(res)
    }
    else if(myurl=="/instrumentos"){
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
        res.write("<h1>Tabela Instrumentos</h1>")
        res.write(`<table class="table">
        <tr>
            <th>ID</th>
            <th>Nome</th>
        </tr>
  `)
        generateTabelaInstrumentos(res)
    }
}).listen(4000)