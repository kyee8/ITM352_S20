// server loads express NOT http

var express = require('express'); // creates 'express' variable thats set to run express
var app = express(); // creates 'app' variable thats set to start up express
var myParser = require("body-parser"); // creates 'myParser' variable thats set to require 'body-parser'

// Retrieved from Professor Port's Assignment 1 Example
    // Uses function to check if string is a non-negative integer
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

// Retrieved from Lab 13
    // Initializes express
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // Logs request method and path to the console;
    next();
});

// Retrieved from Professor Port's Assignment 1 Example
app.get('/products.html', function (req, res, next) {
    data = require('./public/product_data.js');
    products = data.products;
    if (typeof req.query['purchase_submit'] != 'undefined') {
        console.log(Date.now() + ': Purchase made from ip ' + req.ip + ' data: ' + JSON.stringify(req.query)); // logs current date, and outputs array with inputted data, along with query string
    }
    next();
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (req, res) { // posts data from the process form, action being 'process_purchase' 
    res.send(`got a POST for /process_purchase with data ${JSON.stringify(req.body)} `); //sends response with POST confirmation & query string
    // generate invoice
});

app.use(express.static('./public')); // sets up middleware, uses express and pulls files from public folder
app.listen(8080, () => console.log('server listening on port 8080')); // server listens on port 8080, outputs message logged in console
