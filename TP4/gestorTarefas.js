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


function geraPagEdicao(realizadas,pf,t){
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
    <form class="w3-container" action="/tarefas/${t.id}/editado" method="POST">
            <label class="w3-text-teal"><b>Descrição</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="desc" value=${t.desc}>

            <label class="w3-text-teal"><b>Responsável</b></label>
            <input class="w3-input w3-border w3-light-grey" type="text" name="resp" value=${t.resp}>

            <label class="w3-text-teal"><b>Prazo</b></label>
            <input class="w3-input w3-border w3-light-grey" type="date" name="data" value=${t.data}>

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
            <form class="w3-container" action="/tarefas/${t.id}/done" method="POST">
                <input type="hidden" id="desc" name="desc" value="${t.desc}">
                <input type="hidden" id="resp" name="resp" value="${t.resp}">
                <input type="hidden" id="data" name="data" >
                <input type="hidden" id="type" name="type" value="realizadas">
                <input type="submit" value="Feito">
            </form>
            <form class="w3-container" action="/tarefas/${t.id}/editar" method="GET">
            <input type="submit" value="editar">
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
    <form class="w3-container" action="/tarefas/newtask" method="POST">
                <input class="w3-input w3-border w3-light-grey" type="hidden" name="id" >
          
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="desc">

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="resp">

                <label class="w3-text-teal"><b>Prazo</b></label>
                <input class="w3-input w3-border w3-light-grey" type="date" name="data">

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
            <form class="w3-container" action="/tarefas/${t.id}/done" method="POST">
                <input type="hidden" id="desc" name="desc" value="${t.desc}">
                <input type="hidden" id="resp" name="resp" value="${t.resp}">
                <input type="hidden" id="data" name="data" >
                <input type="hidden" id="type" name="type" value="realizadas">
                <input type="submit" value="Feito">
            </form>
            <form class="w3-container" action="/tarefas/${t.id}/editar?" method="GET">
            <input type="submit" value="Editar">
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
                axios.delete('http://localhost:3000/tarefas/'+idTask)
                axios.all([
                    axios.get("http://localhost:3000/tarefas?type=realizadas"),
                    axios.get("http://localhost:3000/tarefas?type=porfazer")
                ])
                    .then(axios.spread((r,pf) => {
                        
                        var realizadas = r.data
                        var porfazer = pf.data
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

            else if(/\/tarefas\/(\w|\d)+\/editar\?$/.test(req.url)){
                var idTask = req.url.split("/")[2]
                axios.all([
                    axios.get("http://localhost:3000/tarefas?type=realizadas"),
                    axios.get("http://localhost:3000/tarefas?type=porfazer")
                ])
                    .then(axios.spread((r,pf) => {
                        
                        var realizadas = r.data
                        var porfazer = pf.data
                        axios.get("http://localhost:3000/tarefas/"+idTask)
                            .then(t => {
                                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                                res.write(geraPagEdicao(realizadas,porfazer,t.data))
                                res.end()
                            })
                        

                    }))
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possi­vel obter a lista de alunos...")
                        res.end()
                    })
            }

        
            
            break
        case "POST":
            var urls = req.url.split('/')
            if(urls[2] == 'newtask'){
                recuperaInfo(req,resultado => {
                    console.log('POST de aluno:' + JSON.stringify(resultado))
                    axios.post('http://localhost:3000/tarefas',resultado)
                    axios.all([
                        axios.get("http://localhost:3000/tarefas?type=realizadas"),
                        axios.get("http://localhost:3000/tarefas?type=porfazer")
                    ])
                        .then(axios.spread((r,pf) => {
                            
                            var realizadas = r.data
                            var porfazer = pf.data
                            res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(realizadas,porfazer,d))
                            res.end()
    
                        }))
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possi­vel obter a lista de alunos...")
                            res.end()
                        })
                
                })
            }
            else if (urls[3]=="done"){
                axios.get("http://localhost:3000/tarefas/"+urls[2])
                    .then(async t =>{
                        task = t.data
                        
                        await axios.put("http://localhost:3000/tarefas/"+task.id,{
                            "id":task.id,
                            "desc": task.desc,
                            "data": new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
                            "resp":task.resp,
                            "type":"realizadas"
                        
                        })
                        console.log(new Date().getDate()+"/"+new Date().getMonth()+"/"+new Date().getFullYear())
                        axios.all([
                            axios.get("http://localhost:3000/tarefas?type=realizadas"),
                            axios.get("http://localhost:3000/tarefas?type=porfazer")
                        ])
                            .then(axios.spread((r,pf) => {
                                
                                var realizadas = r.data
                                var porfazer = pf.data
                                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                                res.write(geraPagPrincipal(realizadas,porfazer,d))
                                res.end()
        
                            }))
                            .catch(function(erro){
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possi­vel obter a lista de tarefas...")
                                res.end()
                            })
                    
                    })
            }
           
            else if(urls[3]=="editado"){
                recuperaInfo(req, async resultado => {
                    console.log('POST de aluno:' + JSON.stringify(resultado))

                    axios.get("http://localhost:3000/tarefas/"+urls[2])
                    .then(async t =>{
                        task = t.data
                        
                        await axios.put("http://localhost:3000/tarefas/"+task.id,{
                            "id":task.id,
                            "desc": resultado.desc,
                            "data":resultado.data,
                            "resp":resultado.resp,
                            "type":resultado.type
                        
                        })
                        axios.all([
                            axios.get("http://localhost:3000/tarefas?type=realizadas"),
                            axios.get("http://localhost:3000/tarefas?type=porfazer")
                        ])
                            .then(axios.spread((r,pf) => {
                                
                                var realizadas = r.data
                                var porfazer = pf.data
                                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                                res.write(geraPagPrincipal(realizadas,porfazer,d))
                                res.end()
        
                            }))
                            .catch(function(erro){
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possi­vel obter a lista de tarefas...")
                                res.end()
                            })
                    
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