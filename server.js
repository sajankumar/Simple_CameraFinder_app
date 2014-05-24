const IP   = '127.0.0.1';
const PORT = 3000;


var http = require('http').createServer(serverHandler);
var fs   = require('fs');
var url  = require('url');
var ext  = require('path');
var qs   = require('querystring');


function serverHandler(req,res){
    
  //var route = rootfolder + url.parse(req.url).pathname;
  //console.log('URL : '  + route);
    
  var filepath = '.'+req.url;
    
   console.log('current file path : '+filepath);    
   
   if(filepath === './')
   {
       filepath = './www/index.html';
   }
   else 
   {
     filepath = './www'+req.url;  
   }
  
  console.log('before read file : ' + filepath);
    
  fs.readFile(filepath,function(error, file){
        
     if(error){res.writeHead(404);res.end('File NOT FOUND');return;}
          console.log('MIME TYPE :' + ext.extname(filepath));
          res.writeHead(200,{'content-type':ext.extname(filepath)});
          res.end(file);     
  });

  postORget(req,res);
}

function postORget(req,res){
    console.log('METHOD : '  + req.method)
    switch(req.method)
    {
       case "POST":
            var bodydata = '';
            req.on('data',function(data){
                bodydata += data
            });
            
            req.on('end',function(){
                console.log(qs.parse(bodydata));
                var data = qs.parse(bodydata);
                res.writeHead(200,{'content-type':'text/json'});
                res.end(JSON.stringify(data));
            });
            break;
       case "GET":
            
            break;
    }
}

http.listen(PORT,IP);
console.log("server running on " +  PORT)
