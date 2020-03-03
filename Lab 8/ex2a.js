var age = 22;
var count = 1;
while (count <= age) {
    console.log (count++);
    if (count > age/2) {
        console.log ("I'm old!");
        break;
    }
}
 