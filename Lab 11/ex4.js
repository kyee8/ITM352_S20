// Ex4a

function isNonNegInt(q) {
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return (errors.length == 0);
    }
console.log(isNonNegInt());

// Ex4b

function isNonNegInt(q, returnErrors = false) {
errors = []; // assume no errors at first
if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
return returnErrors ? errors : (errors.length == 0);
}

pieces.forEach(function (item, index) {
    console.log((typeof item == 'string' && item.length > 0) ? true : false)
});