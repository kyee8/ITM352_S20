// Name: Kristen Yee
// Description: Server processing for e-commerce purse website

// server loads express NOT http
var fs = require('fs');
var user_info_file = './user_data.json';
var userdata = fs.readFileSync(user_info_file, 'utf-8');
var express = require('express'); // creates 'express' variable thats set to run express
var app = express(); // creates 'app' variable thats set to start up express
var myParser = require("body-parser"); // creates 'myParser' variable thats set to require 'body-parser'
const querystring = require('querystring');
var quantity_str;

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
app.get('/products.html', function (request, response, next) {
    data = require('./public/product_data.js');
    products = data.products;
    if (typeof request.query['purchase_submit'] != 'undefined') {
        console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(request.query)); // logs current date, and outputs array with inputted data, along with query string
    }
    next();
});

app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) { // posts data from the process form, with action named "process_form"
let POST = request.body; // lets POST variable hold contents of the body 
    var hasPurchases = false; // sets hasPurchases variable to false, assuming that the quantity of purchases starts off as false
    for (i = 0; i < products.length; i++) { // For loop that generates length of products by +1, (i=i+1 -> post increment: use the value of i first, then increment)
        q = POST[`quantity${i}`]; // assigns q variable to the quantity that is submitted by the user
        if (q > 0) { // if the quantity entered is more than zero
            hasPurchases = true; // then hasPurchases variable is now set at true, as the user has entered a valid quantity of at least 1
        }
        var qString = querystring.stringify(POST); // creates qString variable to string the query together
        if (isNonNegInt(q) == true && hasPurchases == true) { // if the quantity is a valid integer and the quantity is valid for purchase
            response.redirect("/login?" + qString); // then redirect the user to the login page with the qString path
    } else {
        response.redirect("./products.html?" + qString); // everything else is assumed to be invalid data, redirecting the user to the products.html (shop) page along with the qString path
    }
    }
});


// Retrieved from Lab 14
if (fs.existsSync(user_info_file)) {
    var file_stats = fs.statSync(user_info_file);
    var data = fs.readFileSync(user_info_file, 'utf-8');
    var userdata = JSON.parse(data);

    fs.writeFileSync(user_info_file, JSON.stringify(userdata));

    console.log(userdata); 
    console.log(`${user_info_file} has ${file_stats.size} characters`);

} else { 
    console.log ("hey!" + user_info_file + "doesn't exist");
}
    
app.use(myParser.urlencoded({ extended: true }));



app.get("/login", function (request, response) {
    quantity_str = request.query;
    
    // Give a simple login form
    str = `
<body>
    <form action="/login" method="POST"> 
        <h1>Please Log In</h1>
        <div class="container">
        <label for="username"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="username" value=${request.query["username"]}>  <!––Makes username sticky--> 
    
        <label for="password"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" >
    
        <button type="submit" class="loginbtn">Log In</button>
        </div> 


      <div class="container" style="background-color:#fadadd">
        <span class="newuser">New user? Click <a href="/register">HERE</a> to register!</span>
      </div>
      </form>
</body>

        <style>
        body {font-family: Arial, Helvetica, sans-serif;}
        form {border: 30px solid #ffb6c1;}

        h1 {
          text-align: center;
          margin-top: 3%;

        }
        
        input[type=text], input[type=password] {
          width: 100%;
          padding: 15px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
        
        .loginbtn {
          background-color: #ffb6c1;
          color: white;
          padding: 20px 40px;
          text-align: center;
          font-size: 16px;
          margin-top: 3%;
          margin-left: 35%;
          margin-bottom: 3%;
          width: 30%;
          cursor: pointer;
        }
        
        .loginbtn:hover {
          opacity: 0.8;
        }
        
        .container {
          padding: 60px;
        }
        
        span.psw {
          float: right;
          padding-top: 2-px;
        }
        </style>
    `;
    response.send(str);
 });

 // Retrieved from Lab 14 with Professor Port's help
 app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    console.log(quantity_str);
    var err_str = "";
    var login_username = request.body.username;
    quantityQuery_str = querystring.stringify(quantity_str);

    // checks if username exists in reg data. if so, check if password is correct
    if (typeof userdata[login_username] !='undefined') {
        var user_info = userdata[login_username];
        //checks if password stored for username matches what user typed in
        if (user_info["password"] != request.body["password"]) {
          response.send("Sorry! Wrong username. Please go back and try again.");
        }  else {
            response.redirect('./invoice.html?' + quantityQuery_str + `&username=${login_username}`);
            return;
        }
    } else {
      response.send("Sorry! Wrong password. Please go back and try again.");
    }
    response.redirect('./login.html?' + quantityQuery_str + `&username=${login_username}`);

  });


app.get("/register", function (request, response) {
    // Give a simple register form
    str = `

<body>
<form action="/register" method="POST">
<div class="container">
    <h1>Register</h1>
    <p>Please fill in this form to create an account.</p>
    <hr>

    <label for="name"><b>Name</b></label>
    <input type="text" placeholder="Enter Full Name" name="name" required>

    <label for="username"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" name="username" required>

    <label for="email"><b>Email</b></label>
    <input type="text" placeholder="Enter Email" name="email" required>

    <label for="password"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="password" required>

    <label for="repeat_password"><b>Repeat Password</b></label>
    <input type="password" placeholder="Repeat Password" name="repeat_password" required>
    <hr>

    <button type="submit" class="registerbtn">Register</button>
  </div>
  </form>

  <style>

  body {font-family: Arial, Helvetica, sans-serif;}
        form {border: 30px solid #ffb6c1;}

        h1 {
          text-align: center;
          margin-top: 3%;

        }

  * {box-sizing: border-box}

/* Add padding to containers */
.container {
  padding: 16px;
}

/* Full-width input fields */
input[type=text], input[type=password] {
    width: 100%;
    padding: 15px;
    margin: 5px 0 22px 0;
    display: inline-block;
    border: none;
    background: #f1f1f1;
}

input[type=text]:focus, input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit/register button */
.registerbtn {
  background-color: #ffb6c1;
  color: white;
  padding: 20px 40px;
  text-align: center;
  font-size: 16px;
  margin-top: 3%;
  margin-left: 35%;
  margin-bottom: 3%;
  width: 30%;
  cursor: pointer;
}

.registerbtn:hover {
  opacity:1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
}

  </style>

</body>
    `;
    response.send(str);
 });


  // Retrieved from Lab 14 with Professor Port's help
 app.post("/register", function (request, response) {
    // process a simple register form
    console.log(request.body);
    console.log(quantity_str);
    name = request.body.name;
    username = request.body.username;
    email = request.body.email;
    password = request.body.password.toLowerCase(); // Makes password case sensitive
    repeat_password = request.body.repeat_password.toLowerCase(); // Makes repeat password case sensitive
    errs = [];
    
  // Name
  if ((request.body.name.length > 30) ==true){
    errs.push(" Please input a name with 30 characters or less."); //if length is more than 10, show error to make the username shorter
  }
  // Check if username is taken
  if (typeof userdata[username] != 'undefined') {
    errs.push(" Sorry! Username is already taken. Please go back and input a different one. ");
  } 
  if ((username.length > 10) ==true){
    errs.push(" 4-10 characters are required for username! Please make your username shorter. "); //if length is more than 10, show error to make the username shorter
  }
  if ((username.length < 4) ==true){
    errs.push(" 4-10 characters are required for username! Please make your username longer. "); //if length is less than 4, show error to make the username longer
  } 
    //is pass same as repeat pass
  if (request.body.password != request.body.repeat_password) {
    errs.push(" Sorry! The passwords you inputted do not match. Please go back and try again. ");
  }
  if ((request.body.password.length < 6) ==true){
    errs.push(" At least 6 characters are required for password! Please make your password longer. ");
  } 
  if (errs.length == 0) {
    userdata[username] = {};
    userdata[username].name = request.body.name
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email;
    
      fs.writeFileSync(user_info_file, JSON.stringify(userdata));
      quantityQuery_str = querystring.stringify(quantity_str);
          response.redirect('./invoice.html?' + quantityQuery_str + `&username=${username}`);
    } else {
        response.end(JSON.stringify(errs));
    }
});


app.use(express.static('./public')); // sets up middleware, uses express and pulls files from public folder
app.listen(8080, () => console.log('server listening on port 8080')); // server listens on port 8080, outputs message logged in console