// Name: Kristen Yee
// Description: Server processing for e-commerce purse website

// Retrieved from Lab 13
// server loads express NOT http
var fs = require('fs');
var user_info_file = './user_data.json'; // assigns user data from user_data.json file to variable user_info_file
var userdata = fs.readFileSync(user_info_file, 'utf-8'); // assigns userdata variable to readFileSync(user_info_file) to read the full content of the file in memory before returning data
var express = require('express'); // creates 'express' variable thats set to run express
var app = express(); // creates 'app' variable thats set to start up express
var myParser = require("body-parser"); // creates 'myParser' variable thats set to require 'body-parser'
const querystring = require('querystring');
var quantity_str;
data = require('./public/product_data.js');
var products = data.products;

// Retrieved from Lab 15
var cookieParser = require('cookie-parser'); // assigns cookieParser variable to require cookie-parser 
app.use(cookieParser());

var session = require('express-session'); // assigns session variable to require express-session 
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


// Sourced from Professor Port's Office Hours
app.get("/invoice", function (request, response, next) { //created to generate invoice page
  console.log(request.session.cart); //log the session cart data into the console
  var str = "";
  str += `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css">
  <header>
  <h1>Beautifully Designed<br>----- Invoice -----</h1> 

</header>`
  if (session.username != undefined) { // if session username is not undefined
    str += `<h3><p style="color:red">Thank you for you purchase ${session.username}! </p></h3>` // generate UI thank you message for user if they are logged in

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

    //for loops that generate products that the customer orders and posts them on the invoice page
    for (product_type in request.session.cart) { // for every product type detected in the sessions cart
      for (i = 0; i < products[product_type].length; i++) { // A for loop generates length of products by product type from product_data.js file onto the invoice page, (i=i+1 -> post increment: use the value of i first, then increment)
        //variable used to check that the quantities of the products
        q = request.session.cart[product_type][`quantity${i}`]; // sets q variable to the quantities of items inputted inside session
        if (q == 0) { // if products quantitiy equals 0
          continue;  //continue, breaking one iteration in loop
        }
        //extended price is the price of each product times the amount of that item added
        extended_price = products[product_type][i]["price"] * q;
        subtotal += extended_price;
        //this string posts item submitted from cart on the invoice page
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
    if (subtotal > 0 && subtotal <= 2500) { // If subtotal is greater than $0 but less than or equal to $2,500, shipping = $5
      shipping = 5;
    }
    else if (subtotal > 2500 && subtotal <= 5000) { // Else if subtotal is greater than $2500 but less than or equal to $5,000, shipping = $10
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
  
  <!--Generates invoice table for subtotal, tax, shipping & total (fixed to 2 deci places) from customers purchase-->
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
    if (grand_total == 0) { //if grand_total = 0, cart must be empty so send them a response saying that no invoice was generated
      response.send(` 
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css"> 
  <h2>No invoice was generated <br>Please go <a href="./">back</a>, add items to your cart, log into your account, & submit purchase to receive invoice</h2>`);
    } else { //else, send the invoice to email
      //code here to send variable str to email

      //sends an email to the users' email, retrieved from https://www.w3schools.com/nodejs/nodejs_email.asp

      var userInfo = userdata[session.username];
      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'beautifullydesigned808@gmail.com',
          pass: 'password808'
        }
      });

      var mailOptions = {
        from: 'beautifullydesigned808@gmail.com',
        to: userInfo['email'],
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

      str += `<h1>Your invoice was sent to ${userInfo['email']}</h1>`
      request.session.destroy(); // after invoice is sent, customer session is destroyed and cart is cleared
      session.username = undefined; // session username becomes undefined, clearing UI messages

      response.send(str);
    }
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


  if (session.username != undefined) { // if session username is not undefined, send user a UI message that they are logged in + a links that'll either take them back to shopping (if they change their mind & want to shop more) or cart (to double check items & submit for final purchase when ready)
    str += `<h3> <p style="color:red">Welcome ${session.username}! You are currently logged in. </p></h3> <!--UI message for user if they are logged in-->`
  }

  //variabes created to keep track of extended price, subtotal, tax rate and shipping costs for cart
  extended_price = 0;
  subtotal = 0;
  var tax_rate = 0.0575;
  shipping = 0;

  //for loops that generate products that the customer orders and posts them on the cart page
  for (product_type in request.session.cart) { // for every product type detected in the sessions cart
    for (i = 0; i < products[product_type].length; i++) { // A for loop generates length of products by product type from product_data.js file onto the cart page, (i=i+1 -> post increment: use the value of i first, then increment)
      //variable used to check that the quantities of the products selected inside session
      q = request.session.cart[product_type][`quantity${i}`]; // sets q variable to the quantities of items inputted inside session
      if (q == 0) { // if products quantitiy equals 0
        continue; //continue, breaking one iteration in loop
      }
      //extended price is the price of each product times the amount of that item added
      extended_price = products[product_type][i]["price"] * q;
      subtotal += extended_price;
      //this string posts items added to cart on the cart page
      str += `
   

    <body>     
    <form action="/display_cart" method="POST"> <!--Form that POSTS items selected from users' session-->

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
  if (subtotal > 0 && subtotal <= 2500) { // If subtotal is greater than $0 but less than or equal to $2,500, shipping = $5
    shipping = 5;
  }
  else if (subtotal > 2500 && subtotal <= 5000) { // Else if subtotal is greater than $2500 but less than or equal to $5,000, shipping = $10
    shipping = 10;
  }
  else if (subtotal > 5000) { // Else if subtotal is greater than $5,000, shipping = $0 (free)
    shipping = 0; // Free shipping!
  }
  //calculate the tax by multiplying the tax rate to the subtotal
  var tax = tax_rate * subtotal;
  //calculate the grand total by adding subtotal with tax and shipping
  var grand_total = subtotal + tax + shipping;

  // html that displays the carts cost information to the str variable
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
  if (grand_total == 0) { // if grand_total = $0, cart must be empty so send a message that leads them back to shop in order for them to view items in their cart
    response.send(`
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
  <link rel="stylesheet" href="./product_style.css"> 
  <h2>Your cart is empty <br>Please go <a href="./">back</a> and add items to view your cart</h2>`);
  }

  response.send(str);

});


app.post("/display_cart", function (request, response) { // posts data from the display_cart form, with action named "display_cart" (activated when submit purchase button is clicked in cart)
  if (typeof session.username != "undefined") { // if the session username is not undefined
    response.redirect('./invoice'); // they must already be logged in if their username is defined so redirect them to the invoice
  } else { // everything else
    response.redirect('./login'); // redirect to the /login so they can login (required to view invoice)

  }
});



app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) { // posts data from the process form, with action named "process_form"
  if (typeof request.session.cart == "undefined") { // if the sessions cart is undefined
    request.session.cart = {}; // set cart to empty
  }
  let POST = request.body; // lets POST variable hold contents of the body 
  var hasPurchases = false; // sets hasPurchases variable to false, assuming that the quantity of purchases starts off as false
  var isValidData = true; // sets is ValidData variable to true, assuming that the data entered is valid
  console.log(products);

  if (typeof POST["product_type"] != "undefined") { // if "product_type" string is not undefined
    var product_type = POST["product_type"]; // set product_type variable to request the body of "product_type" string
    for (i = 0; i < products[product_type].length; i++) { // For loop that generates length of products by their product type by +1, (i=i+1 -> post increment: use the value of i first, then increment)
      q = POST[`quantity${i}`]; // assigns q variable to the quantity that is submitted by the user
      if (q > 0) { // if the quantity entered is more than zero
        hasPurchases = true; // then hasPurchases variable is now set at true, as the user has entered a valid quantity of at least 1
      }
      if (isNonNegInt(q) == false) { // if quantity entered fails isNonNegInt function
        isValidData = false; // then isValidData is now set at false, as the user probably entered invalid data (negative, not an integer, letters, etc)
      }

    }
  } // Received help from Professor Port's office hours
  var qString = querystring.stringify(POST); // creates qString variable to string the query together
  if (isValidData == true && hasPurchases == true) { // if the quantity is a valid integer and the quantity is valid for purchase + add the valid amount to cart
    request.session.cart[product_type] = POST; // then request the body of sessions cart data by product type
    qString += "&addedToCart=true"; // add to qString a string in URL that identifies that something valid has been added to the cart (created & used to send alert that items have been added on page)
    console.log(request.session.cart); // log the sessions cart into the console
  }
  response.redirect(`${request.headers["referer"]}?` + qString); // redirects to same page with same qString when items are added
});


// Retrieved from Lab 14
// Checks to see if the file exists
if (fs.existsSync(user_info_file)) {
  var data = fs.readFileSync(user_info_file, 'utf-8');
  var userdata = JSON.parse(data);
} else {
  console.log("hey!" + user_info_file + "doesn't exist"); // else, sends message to console that file doesn't exist
}

app.use(myParser.urlencoded({ extended: true }));


app.get("/login", function (request, response) { //created to display login page
  console.log(request.query); // print out q-str
  if (typeof request.cookies['username'] != 'undefined') {
    str = `Welcome ${request.cookies['username']}!`
  } else {
    quantity_str = request.query;

    // Give a simple login form


    str = `
<body>
    <form action="/login" method="POST">`

    if (session.username != undefined) { // if sessions username is not undefined, send a UI personalized user message that lets them know their login was successful, the time & date they logged in, and tells them to go back to shop (if login link in navbar is clicked again after successfully logging in, this message will help prevent them from logging in more than once )
      str += `<h1>Hello ${session.username}! You logged in at ${session.last_login_time}<br><p style="color:red"> Please Go Back to Shop</p><br>_______________________________________</h1> `
    }

    str += `<h1>Log In</h1> <!--html that displays the login page-->
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
app.post("/login", function (request, response) { // POST to /login activated when login button is pressed
  console.log(request.body);
  console.log(quantity_str);
  var err_str = "";
  var login_username = request.body.username; // sets login_username to whatever username was entered on page
  quantityQuery_str = querystring.stringify(quantity_str); // Strings query together and sets it to quantityQuery_str variable

  // Checks if username exists in reg data. if so, check if password is correct
  if (typeof userdata[login_username] != 'undefined') { // checks if userdata has a matching username, if not it will be undefined
    var user_info = userdata[login_username]; // sets user_info variable to userdata username
    //checks if password stored for username matches what user typed in
    if (user_info["password"] != request.body["password"]) { // if password entered doesn't match whats stored
      request.query.stickUsername = login_username; // make the username stick so don't need to re-enter when they go back
      response.send("Sorry! Wrong password. Please go back and try again."); // Send error message to go back and try another password
    } else {
      session.username = login_username; // set the login_username variable to the sessions username
      var theDate = Date.now(); // set theDate variable to current time
      session.last_login_time = theDate; // sets sessions last log in time to data from theDate variable
      response.send(` <!--send user a UI personalized message that they are logged in with date/time they logged in + links that lead the user back to shopping or back to cart-->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comfortaa">
      <link rel="stylesheet" href="./product_style.css"> 
      <h2>${login_username} is logged in on ${theDate} <br><br>- Click <a href="./">here</a> to continue shopping<br>- Click <a href="./display_cart">here</a> to go back to cart</h2>
      `);
    }

  } else {
    response.send("Sorry! Wrong username. Please go back and try again."); // Else must be wrong username, so send error message to input another username
  }
  response.redirect('./login?' + quantityQuery_str + `&username=${login_username}`);

});

app.post("/logout", function (request, response) { // POST to /logout activated when logout button is pressed
  request.session.destroy(); // when pressed, session is destroyed & cart is empty
  session.username = undefined; // session username becomes undefined, clearing UI messages
  response.redirect('./') // redirects user to home page
});



app.get("/register", function (request, response) { // created to generate registration page
  // Give a simple register form
  str = `

<body>
<form action="/register" method="POST">
<div class="container">
    <h1>Register</h1>
    <p>Please fill in this form to create an account.</p> <!--html for registration page-->
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
    response.redirect('./invoice'); // redirects user to their cart upon successful registration, requiring them to log in with new account info to gain access to purchase items in their cart
  } else {
    response.end(JSON.stringify(errs)); // everything else, stringify errs
    console.log(errs) // log errs into the console
  }
});


app.use(express.static('./public')); // sets up middleware, uses express and pulls files from public folder
app.listen(8080, () => console.log('server listening on port 8080')); // server listens on port 8080, outputs message logged in console
