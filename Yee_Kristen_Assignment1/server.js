// loads express NOT http
var express = require('express');
var app = express();
var myParser = require ("body-parser");

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });

 app.use(myParser.urlencoded({ extended: true }));

 app.post("/process_purchase", function (request, response, next) {
    response.send('got a POST for /process_purchase with data ${request.body}');
 }); 

app.use(express.static('./public'));// sets up middleware, if don't respond to anything above, looks in public folder & pulls index.html file
app.listen(8080, () => console.log(`listening on port 8080`));

//static says if u don't as for anything, itll automatically pull index.html