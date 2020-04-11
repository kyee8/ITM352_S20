// loads express NOT http
var express = require('express');
var app = express();
var myParser = require ("body-parser");

function checkQuantityTextbox (theTextbox) {
    var errs = isNonNegInt(theTextbox.value, true);
    qty_textbox_message.innerHTML = errs.join (","); 
}

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });

 app.use(myParser.urlencoded({ extended: true }));
 app.post("/process_form", function (request, response) {
    let POST = request.body;
    if (typeof POST['quantity_textbox'] != 'undefined') {
        q = POST ["quantity_textbox"];
         if (isNonNegInt(q,false)) {
            response.send(`Thank you for purchasing ${q} things!`); 
        } else {
            response.send(`${q} is not a quantity! Press the back button and try again.`);   
        }
    }
 }); 

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));