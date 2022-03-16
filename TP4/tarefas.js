var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')


// Retrieves student info from request body
function recuperaInfo(request, callback){
    if(request.headers['content-type'] ==
                    'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            callback(parse(body))
        })
    }
}



function geraPostConfirm(t,d){
    return `
    <html>
        <head>
            <title>Ação efetuada</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
    
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1>Ação efetuada</h1>
                </header>
            <div class="w3-container">
                <p> <a href="http://localhost:7777/tarefas"> Aceda à página</p>
            
            </div>


        <footer class="w3-container w3-teal">
            <address>Gerado por gtarefa::RPCW2022 em ${d} - [<a href="/">Voltar</a>]</address>
        </footer>
        </div>
</body>
</html>



    `
}



// Template para a página com a lista de alunos ------------------
function geraPagPrincipal( realizadas,pf, d){
    let pagHTML = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    * {
      box-sizing: border-box;
    }
    
    /* Create two equal columns that floats next to each other */
    .column {
      float: left;
      width: 50%;
      padding: 10px;
    }
    
    /* Clear floats after the columns */
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
    </style>
    </head>
    <body>
    
    <h2>Gestor de tarefas</h2>
    <form class="w3-container" action="/tarefas" method="POST">
                <label class="w3-text-teal"><b>id</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id">
          
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="desc">

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="resp">

                <label class="w3-text-teal"><b>Prazo</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="data">

                <input type="hidden" id="type" name="type" value="porfazer">

                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
    <div class="row">
      <div class="column" style="background-color:#aaa;">
        <h2>Tarefas por fazer</h2>
        <ul>
        `
    pf.forEach(t => {
        pagHTML += `
        <li>
        ${t.desc}, a realizar por ${t.resp} até ${t.data}
            <form class="w3-container" action="/tarefas" method="POST">
                <input type="hidden" id="desc" name="desc" value="${t.desc}">
                <input type="hidden" id="resp" name="resp" value="${t.resp}">
                <input type="hidden" id="data" name="data" value=${new Date()}>
                <input type="hidden" id="type" name="type" value="realizadas">
                <input type="submit" value="Feito">
            </form>
            <form class="w3-container" action="/tarefas/${t.id}/apagar" method="GET">
            <input type="submit" value="Delete">
             </form>
        
        </li>
        `
    });    


    pagHTML += `
        </ul>
      </div>
      <div class="column" style="background-color:#bbb;">
        <h2>Tarefas realizadas</h2>
        <ul>
    `

    realizadas.forEach(t => {
        pagHTML += `
        <li>${t.desc}, foi realizada por ${t.resp} em ${t.data}
        <form class="w3-container" action="/tarefas/${t.id}/apagar" method="GET">
            <input type="submit" value="Delete">
        </form></li>
        `
    });

    pagHTML +=`
      </div>
    </div>
    
    </body>
    </html>
    
    `
    return pagHTML
  }


// Criação do servidor

var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req,res)
    }
    else{
    switch(req.method){
        case "GET": 
            // GET /tarefas --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tarefas")){
                axios.all([
                    axios.get("http://localhost:3000/tarefas?type=realizadas"),
                    axios.get("http://localhost:3000/tarefas?type=porfazer")
                ])
                    .then(axios.spread((r,pf) => {
                        
                        var realizadas = r.data
                        var porfazer = pf.data

                        // Add code to render page with the student's list
                        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                        res.write(geraPagPrincipal(realizadas,porfazer,d))
                        res.end()

                    }))
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possi­vel obter a lista de alunos...")
                        res.end()
                    })
            }
            // GET /tarefas/:id/apagar
            else if(/\/tarefas\/(\w|\d)+\/apagar\?$/.test(req.url)){
                var idTask = req.url.split("/")[2]
                console.log(idTask)
                axios.delete('http://localhost:3000/tarefas/'+idTask)
                    .then(resp =>{
                        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                        res.write(geraPostConfirm(resp.data,d))
                        res.end()                    
                    }).catch(error =>{
                        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p> Erro no POST: '+error+'</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
            }

        
            
            break
        case "POST":
            if(req.url == '/tarefas'){
                recuperaInfo(req,resultado => {
                    console.log('POST de aluno:' + JSON.stringify(resultado))
                   
                    axios.post('http://localhost:3000/tarefas',resultado)
                        .then(resp => {
                            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                            res.write(geraPostConfirm(resp.data,d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p> Erro no POST: '+erro+'</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                
                })
            }
            
            else {
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                res.write('<p>Recebi um POST não suportado.</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " nÃ£o suportado neste serviÃ§o.</p>")
            res.end()
    }
}
})

galunoServer.listen(7777)
console.log('Servidor Ã  escuta na porta 7777...')