attributes  =  "kristen;22;22 + 0.5;0.5 - 22" ;
var pieces = attributes.split (';');
for (i=0; i<pieces.length; i++) {
    console.log(pieces[i], typeof pieces[i], isNonNegInt(pieces[i]));
}

//ex 5a
pieces.forEach(printIt);

function printIt(item,index) {
    console.log(pieces[i], typeof pieces[i], isNonNegInt(pieces[i]));
}

//ex 5b
pieces.forEach(printIt);
pieces.forEach(
    function () {console.log((typeof item == 'string' && item.length > 0) ? true : false)

    })


function isNonNegInt(q) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return (errors.length == 0);
    }
