var fs = require('fs');
var user_info_file = './user_data.json';
var userdata = fs.readFileSync(user_info_file, 'utf-8');
var express = require('express');
var app = express();
var myParser = require("body-parser");

if (fs.existsSync(user_info_file)){
    var file_stats = fs.statSync(user_info_file);
    var data = fs.readFileSync(user_info_file, 'utf-8');
    userdata = JSON.parse(data);

    //console.log(userdata["kazman"] ["password"], userdata.kazman.email); 
  // console.log(`${user_info_file} has ${file_stats.size} characters`);

} else { 
    console.log ("hey!" + user_info_file + "doesn't exist");
}
    



app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="/login?quantity=999" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body, userdata);
    var login_username = request.body.username;
    // checks if username exists in reg data. if so, check if password is correct
    if (typeof userdata[login_username] !='undefined') {
        var user_info = userdata[login_username];
        //checks if password stored for username matches what user typed in
        if (user_info["password"] != request.body["password"]) {
            err_str = 'bad_password';
        }  else {
            response.end(`${login_username} is logged in`);
        }
} else {
        err_str = `bad_username`;
    }
    response.redirect(`./login)?username = ${login_username}&error= ${err_str}`);
});

app.listen(8080, () => console.log(`listening on port 8080`));
