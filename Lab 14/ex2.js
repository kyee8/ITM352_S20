var fs = require('fs');
var user_info_file = './user_data.json';
var data = fs.readFileSync(user_info_file, 'utf-8');

if (fs.existsSync(user_info_file)){
    var file_stats = fs.statSync(user_info_file);
    var data = fs.readFileSync(user_info_file, 'utf-8');
    userdata = JSON.parse(data);

    console.log(userdata["kazman"] ["password"], userdata.kazman.email); 
    console.log(`${user_info_file} has ${file_stats.size} characters`);

} else { 
    console.log ("hey!" + user_info_file + "doesn't exist");
}
    
