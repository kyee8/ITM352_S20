// Kristen Yee 
// Description: Master file that holds product arrays

// Arrays arranged by product type, the variables are by product type & contain more info about each individual product that pertains to them

var backpacks =
[    
    {
        "product": "Michael Kors Backpack",
        "price": 171.00,
        "image": "./images/MichaelKors_Backpack.jpg"    
    },   
    {
        "product": "Burberry Backpack",
        "price": 1890.00,
        "image": "./images/bberrybackpack.jpg"    
    },  
    {
        "product": "Longchamp Backpack",
        "price": 115.00,
        "image": "./images/longchampbackpack.jpg"    
    },   
   
];

var crossbodys =
[
    {
        "product": "Chanel Crossbody",
        "price": 2500.00,
        "image": "./images/Chanel_Crossbody.jpg"    
    },
    {
        "product": "Kate Spade Crossbody",
        "price": 139.00,
        "image": "./images/KateSpade_Bucket.jpg"    
    },  
    {
        "product": "Gucci Mini Crossbody",
        "image": "./images/Gucci_Crossbody.jpg",
        "price": 980.00,    
    }, 

];   

var purses =
[
    {
        "product": "Balenciaga Purse",
        "price": 1400.00,
        "image": "./images/balenciagapurse.jpg"    
    },
    {
        "product": "Birkin Purse",
        "price": 18000.00,
        "image": "./images/birkinpurse.jpg"    
    },
    {
        "product": "Tory Burch Purse",
        "price": 171.00,
        "image": "./images/toryburchpurse-1.jpg"    
    },  
];   

var totes =
[
    {
        "product": "Louis Vuitton Tote",
        "price": 1510.00,
        "image": "./images/LouisVuitton_Tote.jpg"    
    }, 
    {
        "product": "Coach Tote",
        "price": 200.00,
        "image": "./images/coachtote1.jpg"    
    },   
    {
        "product": "Givency Tote",
        "price": 860.00,
        "image": "./images/givencytote.jpg"    
    },  
]; 

var products = // products variable that holds the arrays of the different item types
{
    "backpacks":backpacks,
    "crossbodys": crossbodys,
    "purses":purses,
    "totes": totes

}

// Retrieved from Professor Port's Assignment 1 Example
    // Makes sure products are defined
if (typeof module != 'undefined') {
    module.exports.products = products;
    }

