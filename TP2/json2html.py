import json
import os
import re

f = open("cinemaATP.json")
movies=[]
filenames=[]
file = json.load(f)
os.mkdir("./filmes")
i=1
for entry in file:
    print(entry["title"])
    title= re.sub("/"," ",entry["title"])
    name= "./filmes/"+str(i)+".html"
    filenames.append(name)
    movies.append(title)
    html= open(name,"w")
    html.write("<html>\n")
    html.write("<head>\n")
    html.write("<title>"+title+"</title>\n")
    html.write("</head>\n")
    html.write("<body>\n")
    html.write("<h1 style=" +"text-align:center>" + entry["title"]+"</h1>\n")
    if(entry["cast"]!=""):
        html.write("Estreou em "+ str(entry["year"])+" com um elenco constituído por:\n")
        html.write("<ul>\n")
        for elem in entry["cast"]:
            html.write("<li>"+elem+"</li>\n")
        
        html.write("</ul>\n")
    
    else:
        html.write("Estreou em "+ str(entry["year"])+"\n")


    html.write("É considerado um filme de ")
    for elem in entry["genres"]:
        html.write(elem +", ")
    html.write("\n")
    html.write("</body>\n")
    html.write("</html>\n")
    i+=1
    

f.close()

index = open("index.html","w")

index.write("<html>\n")
index.write("<head>\n")
index.write("<title>Index</title>\n")
index.write("</head>\n")
index.write("<body>\n")
index.write("<h1 style=" +"text-align:center>Indice</h1>\n")
index.write("<ul>")
for i,movie in enumerate(movies):
    aux = movie.replace("./filmes/","")
    aux = aux.replace(".html","")
    filenames[i] = filenames[i].replace("./","/")
    print(filenames[i]+" filenames        aux: " + aux)
    index.write("<li><a href=\""+filenames[i]+"\">"+aux+"</a></li>\n")
index.write("</ul>")

index.write("</body>")
index.write("</html>")