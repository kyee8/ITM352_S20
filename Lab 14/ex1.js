var fs = require('fs');
var user_info_file = './user_data.json';
var data = fs.readFileSync(user_info_file, 'utf-8');

userdata = JSON.parse(data);

console.log(userdata.kazman.password, userdata.kazman.email);


app.listen(8080, () => console.log(`listening on port 8080`));
