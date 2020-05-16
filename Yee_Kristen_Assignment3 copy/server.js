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
data = require('./public/product_data.js');


var products = data.products;

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({
  secret: "ITM352 rocks!",
  resave: false,
  saveUninitialized: true
}));

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

app.get("/invoice", function (request, response, next) { //created to display items in the shopping cart
  console.log(request.session.cart); //log the session cart data into the console
  var str = "";
  str += `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css">
  <header>
  <h1>Beautifully Designed<br>----- Invoice -----</h1> 


</header>`


  if (session.username != undefined) {
    str += `<h3><p style="color:red">Thank you for you purchase ${session.username}! </p></h3><!--UI message for user if they are logged in-->`
  } //**if no username then send to login



  //variabes created to keep track of extended price, subtotal, tax rate and shipping costs
  extended_price = 0;
  subtotal = 0;
  var tax_rate = 0.0575;
  shipping = 0;
str += `
<table border="2">
<tbody>
  <tr>
    <th style="text-align: center;" width="43%">Item</th>
    <th style="text-align: center;" width="11%">quantity</th>
    <th style="text-align: center;" width="13%">price</th>
    <th style="text-align: center;" width="54%">extended price</th>
  </tr>
`;

  //for loops that generate products that the customer orders and posts them on the cart page
  for (product_type in request.session.cart) {
    for (i = 0; i < products[product_type].length; i++) {
      //variable used to check that the quantities of the products
      q = request.session.cart[product_type][`quantity${i}`];
      if (q == 0) {
        continue;
      }
      //extended price is the price of each product times the amount of that item added
      extended_price = products[product_type][i]["price"] * q;
      subtotal += extended_price;
      //this string will be posted on the cart page
      str += ` 
      <tr>
        <td width="43%">${products[product_type][i]["product"]}</td> 
        <td align="center" width="11%">${q}</td>
        <td width="13%">\$${products[product_type][i]["price"]}</td>
        <td width="54%">\$${extended_price}</td>
      </tr>
      `;
      
    }
  }
  // Compute shipping
  if (subtotal > 0 && subtotal <= 2500) { // If subtotal is less than or equal to $2,500, shipping = $5
    shipping = 5;
  }
  else if (subtotal > 2500 && subtotal <= 5000) { // Else if subtotal is less than or equal to $5,000, shipping = $10
    shipping = 10;
  }
  else if (subtotal > 5000) { // Else if subtotal is greater than $5,000, shipping = $0 (free)
    shipping = 0; // Free shipping!
  }
  //calculate the tax by multiplying the tax rate to the subtotal
  var tax = tax_rate * subtotal;
  //calculate the grand total by adding subtotal with tax and shipping
  var grand_total = subtotal + tax + shipping;

  //add html to display cost information to the str variable
  str += ` 
  
  <!--Generates table for subtotal, tax, shipping & total (fixed to 2 deci places) from customers purchase-->
      <tr>
        <td colspan="4" width="100%">&nbsp;</td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
        <td width="54%">$
          ${subtotal.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @
            ${100 * tax_rate}</span></td>
        <td width="54%">$
          ${tax.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%">Shipping</span></td>
        <td width="54%">$
          ${shipping.toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
        <td width="54%"><strong>$
            ${grand_total.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>

  
`;
if (grand_total == 0) {
  response.send(`
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css"> 
  <h2>Your cart is empty <br>Please go <a href="./">back</a> and add items to view your cart</h2>`);
} else {
//send the invoice to email
//code here to send variable str to email
//if successful add the following to webpage
var userInfo = userdata[session.username];
str += `<h1>Your invoice was send to ${userInfo['email']}</h1>`
request.session.destroy();


  response.send(str);
}
});



// Sourced from Professor Port's help during office hours
app.get("/display_cart", function (request, response, next) { //created to display items in the shopping cart
  console.log(request.session.cart); //log the session cart data into the console
  var str = "";
  str += `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css">
  <header>
  <h1>Beautifully Designed<br>----- Cart -----</h1>
  <ul>
      <li><a href="index.html">HOME</a></li>
      <li><a href="tote.html">TOTES</a></li>
      <li><a href="crossbody.html">CROSSBODYS</a></li>
      <li><a href="backpack.html">BACKPACKS</a></li>
      <li><a href="purse.html">PURSES</a></li>
      <li><a href="aboutus.html">ABOUT US</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="/login">LOGIN</a></li>
      <li><a href="/display_cart">CART</a></li>
  </ul> 


</header>`


  if (session.username != undefined) {
    str += `<h3> <p style="color:red">Welcome ${session.username}! You are currently logged in. </p></h3> <!--UI message for user if they are logged in-->`
  }

  //variabes created to keep track of extended price, subtotal, tax rate and shipping costs
  extended_price = 0;
  subtotal = 0;
  var tax_rate = 0.0575;
  shipping = 0;

  //for loops that generate products that the customer orders and posts them on the cart page
  for (product_type in request.session.cart) {
    for (i = 0; i < products[product_type].length; i++) {
      //variable used to check that the quantities of the products
      q = request.session.cart[product_type][`quantity${i}`];
      if (q == 0) {
        continue;
      }
      //extended price is the price of each product times the amount of that item added
      extended_price = products[product_type][i]["price"] * q;
      subtotal += extended_price;
      //this string will be posted on the cart page
      str += `
   

    <body>     
    <form action="/display_cart" method="POST">

    <div class="shop-item">
    <!--List the product names-->
            <h4><span class="shop-item-title">${products[product_type][i]["product"]}</span>
            <hr class="space" />
            <!--Show the images of each product-->
            <div class="enlarge">
                <img class="shop-item-image" src=${products[product_type][i]["image"]}>
            </div>
            <!--Show the quantity of each product-->
            <hr class="space" />
            <label id="quantity${i}_label" class="shop-item-quantity">Quantity: ${q}</label>
            <div class="shop-item-details">
            <!--List the prices and extended prices-->
                <hr class="space" />
                <span class="shop-item-price">Price: $${extended_price}</span><br></h4>
            </div>
            </div>
       </form>
</body>
`;
    }
  }
  // Compute shipping
  if (subtotal > 0 && subtotal <= 2500) { // If subtotal is less than or equal to $2,500, shipping = $5
    shipping = 5;
  }
  else if (subtotal > 2500 && subtotal <= 5000) { // Else if subtotal is less than or equal to $5,000, shipping = $10
    shipping = 10;
  }
  else if (subtotal > 5000) { // Else if subtotal is greater than $5,000, shipping = $0 (free)
    shipping = 0; // Free shipping!
  }
  //calculate the tax by multiplying the tax rate to the subtotal
  var tax = tax_rate * subtotal;
  //calculate the grand total by adding subtotal with tax and shipping
  var grand_total = subtotal + tax + shipping;

  //add html to display cost information to the str variable
  str += ` 
  <form action="/display_cart" method="POST">
  <footer>
  <h4><div class="shop-item-description">Subtotal: $${subtotal.toFixed(2)}</div>
  <div class="shop-item-description">Shipping: $${shipping.toFixed(2)}</div>
  <div class="shop-item-description">Tax: $${tax.toFixed(2)}</div>
  <div class="shop-item-description">Grandtotal: $${grand_total.toFixed(2)}</div></h4>

  <input type="submit" value="Checkout Cart!" name="submit_cart">
</footer>
</form>`
if (grand_total == 0) {
  response.send(`
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css"> 
  <h2>Your cart is empty <br>Please go <a href="./">back</a> and add items to view your cart</h2>`);
}

  response.send(str);

});


app.post("/display_cart", function (request, response) { // posts data from the display_cart form, with action named "display_cart"
  if (typeof session.username != "undefined") {
    response.redirect('./invoice');
  } else {
    response.redirect('./login');

  }
});



app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) { // posts data from the process form, with action named "process_form"
  if (typeof request.session.cart == "undefined") {
    request.session.cart = {};
  }
  let POST = request.body; // lets POST variable hold contents of the body 
  var hasPurchases = false; // sets hasPurchases variable to false, assuming that the quantity of purchases starts off as false
  var isValidData = true;
  console.log(products);

  if (typeof POST["product_type"] != "undefined") {
    var product_type = POST["product_type"];
    for (i = 0; i < products[product_type].length; i++) { // For loop that generates length of products by +1, (i=i+1 -> post increment: use the value of i first, then increment)
      q = POST[`quantity${i}`]; // assigns q variable to the quantity that is submitted by the user
      if (q > 0) { // if the quantity entered is more than zero
        hasPurchases = true; // then hasPurchases variable is now set at true, as the user has entered a valid quantity of at least 1
      }
      if (isNonNegInt(q) == false) {
        isValidData = false;
      }

    }
  }
  var qString = querystring.stringify(POST); // creates qString variable to string the query together
  if (isValidData == true && hasPurchases == true) { // if the quantity is a valid integer and the quantity is valid for purchase + add the valid amount to cart
    request.session.cart[product_type] = POST;
    //response.redirect("/login?" + qString); // then redirect the user to the login page with the qString path
    qString += "&addedToCart=true";
    console.log(request.session.cart);
  }
  response.redirect(`${request.headers["referer"]}?` + qString); // everything else is assumed to be invalid data, redirecting the user to the products.html (shop) page along with the qString path
});


// Retrieved from Lab 14
// CHacks to see if the file exists
if (fs.existsSync(user_info_file)) {
  var data = fs.readFileSync(user_info_file, 'utf-8');
  var userdata = JSON.parse(data);
} else {
  console.log("hey!" + user_info_file + "doesn't exist"); // else, sends message to console that file doesn't exist
}

app.use(myParser.urlencoded({ extended: true }));

// add a route to get a cookie that may have been set here


app.get("/login", function (request, response) {
  console.log(request.query); // print out q-str
  if (typeof request.cookies['username'] != 'undefined') {
    str = `Welcome ${request.cookies['username']}!`
  } else {
    quantity_str = request.query;

    // Give a simple login form


    str = `
<body>
    <form action="/login" method="POST">`

    if (session.username != undefined) {
      str += `<h1>Hello ${session.username}! You logged in at ${session.last_login_time}<br><p style="color:red"> Please Go Back to Shop</p><br>_______________________________________</h1> `
    }

    str += `<h1>Log In</h1>
        <div class="container">
        <label for="username"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="username"}> 
    
        <label for="password"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="password" >
    
        <button type="submit" class="loginbtn">Log In</button>
        </div> 


      <div class="container" style="background-color:#fadadd">
        <span class="newuser">New user? Click <a href="/register">HERE</a> to register!</span>
      </div>
      </form>

      <form action="/logout" method="POST">
      <button type="submit" class="logoutbtn">Log Out</button>

      </form>
</body>

<!-- Login Styling retrieved from https://www.w3schools.com/howto/howto_css_login_form.asp -->
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
        
        .loginbtn, .logoutbtn {
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
  }

});




// Retrieved from Lab 14 with Professor Port's help
app.post("/login", function (request, response) {
  // Process login form POST and redirect to invoice page if ok, back to login page if not
  console.log(request.body);
  console.log(quantity_str);
  var err_str = "";
  var login_username = request.body.username;
  quantityQuery_str = querystring.stringify(quantity_str); // Strings query together and sets it to quantityQuery_str variable

  // Checks if username exists in reg data. if so, check if password is correct
  if (typeof userdata[login_username] != 'undefined') { // checks if userdata has a matching username, if not it will be undefined
    var user_info = userdata[login_username]; // sets user_info variable to userdata username
    //checks if password stored for username matches what user typed in
    if (user_info["password"] != request.body["password"]) { // if password entered doesn't match whats stored
      request.query.stickUsername = login_username;
      response.send("Sorry! Wrong password. Please go back and try again."); // Send error message to go back and try another password
    } else {
      session.username = login_username;
      var theDate = Date.now();
      session.last_login_time = theDate;
      response.send(`
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
      <link rel="stylesheet" href="./product_style.css"> 
      <h2>${login_username} is logged in on ${theDate} <br><br>- Click <a href="./">here</a> to continue shopping<br>- Click <a href="./display_cart">here</a> to go back to cart</h2>
      `);

      //sends an email to the users' email, retrieved from https://www.w3schools.com/nodejs/nodejs_email.asp
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'beautifullydesigned808@gmail.com',
          pass: 'password808'
        }
      });

      var mailOptions = {
        from: 'beautifullydesigned808@gmail.com',
        to: userdata[username].email,
        subject: 'Beautifully Designed : Thank you!',
        text: 'Thank you for your order. Please shop with us again!'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return;
    }

  } else {
    response.send("Sorry! Wrong username. Please go back and try again."); // Else must be wrong username, so send error message to input another username
  }
  response.redirect('./login?' + quantityQuery_str + `&username=${login_username}`);

});

app.post("/logout", function (request, response) {
  request.session.destroy();
  response.redirect('./')
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

  <!-- Registration Styling retrieved from https://www.w3schools.com/howto/howto_css_register_form.asp -->
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

/* Add a pink text color to links */
a {
  color: pink;
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
  username = request.body.username.toLowerCase(); // Makes username case sensitive
  password = request.body.password.toLowerCase(); // Makes password case sensitive
  email = request.body.email.toLowerCase(); // Makes email case sensitive
  errs = [];

  // Name
  if ((request.body.name.length > 30) == true) {
    errs.push(" Please input a name with 30 characters or less."); // if length of name is more than 30, show error to make name shorter
  }
  // Check if username is taken
  if (typeof userdata[username] != 'undefined') {
    errs.push(" Sorry! Username is already taken. Please go back and input a different one. ");// if username is not undefined, show error message to input another username
  }
  if ((username.length > 10) == true) {
    errs.push(" 4-10 characters are required for username! Please make your username shorter. "); // if length is more than 10, show error to make the username shorter
  }
  if ((username.length < 4) == true) {
    errs.push(" 4-10 characters are required for username! Please make your username longer. "); // if length is less than 4, show error to make the username longer
  }
  //is pass same as repeat pass
  if (request.body.password != request.body.repeat_password) {
    errs.push(" Sorry! The passwords you inputted do not match. Please go back and try again. "); // if password doesn not match the repeat password, show error that passwords don't match
  }
  if ((request.body.password.length < 6) == true) {
    errs.push(" At least 6 characters are required for password! Please make your password longer. "); // if password is not at least 6 characters, show error message that password needs to be longer
  }
  if (errs.length == 0) { // if there are no errors counted, grab store set userdata variables below 
    userdata[username] = {};
    userdata[username].name = request.body.name
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email;

    fs.writeFileSync(user_info_file, JSON.stringify(userdata)); // write the stringified userdata to user_data.json file
    quantityQuery_str = querystring.stringify(quantity_str);
    response.send(`
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
    <link rel="stylesheet" href="./product_style.css"> 
    <h2>New user ${username} registered<br>- Click <a href="./login">here</a> to log into your new account`);
    response.redirect('./invoice'); // redirect user to their cart upon successful registration
  } else {
    response.end(JSON.stringify(errs)); // everything else,
    console.log(errs)
  }
});




app.use(express.static('./public')); // sets up middleware, uses express and pulls files from public folder
app.listen(8080, () => console.log('server listening on port 8080')); // server listens on port 8080, outputs message logged in console