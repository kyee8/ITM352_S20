// Kristen Yee 

// Master array containing information about each of my items, setting them 'products' variable
var products =
[
    {
        "product": "Gucci Mini Crossbody",
        "image": "./images/Gucci_Crossbody.jpg",
        "price": 980.00,    
    },
    {
        "product": "Louis Vuitton Tote Bag",
        "price": 1510.00,
        "image": "./images/LouisVuitton_Tote.jpg"    
    },    
    {
        "product": "Kate Spade Bucket Bag",
        "price": 139.00,
        "image": "./images/KateSpade_Bucket.jpg"    
    },    
    {
        "product": "Michael Kors Backpack",
        "price": 171.00,
        "image": "./images/MichaelKors_Backpack.jpg"    
    },    
    {
        "product": "YSL Shoulder Bag",
        "price": 2000.00,
        "image": "./images/YSL_Shoulder.jpg"    
    },
    {
        "product": "Tory Burch Purse",
        "price": 300.00,
        "image": "./images/ToryBurch_Crossbody.jpg"    
    },
    {
        "product": "Chanel Crossbody",
        "price": 2500.00,
        "image": "./images/Chanel_Crossbody.jpg"    
    },
    {
        "product": "Balenciaga Purse",
        "price": 1400.00,
        "image": "./images/Balenciaga_Purse.jpg"    
    }
];

// Retrieved from Professor Port's Assignment 1 Example
    // Makes sure products are defined
if (typeof module != 'undefined') {
    module.exports.products = products;
    }