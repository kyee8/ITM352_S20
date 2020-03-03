var age = 22;
var count = 1;
while (count++ < age) {
    if (count > (age/2)) {
        process.exit(); 
        console.log ("Do not ask me how old I am!");
        
    } 
}
