
// FOR loop runs & lists products product, image, and price from main array to current page
// ENTER AMOUNT label 
for (i=0; i<products.length; i++) {
    document.write (`
    <section class="item"> 
        <h2>${(products[i].product)}</h2> 
        <img src="${(products[i].image)}">
        <p><h2>$${(products[i].price)}</h2></p>  
        <div>
                <label id="quantity${i}_label"}">Quantity:</label>
                 <input type="text" placeholder="ENTER AMOUNT" name="quantity${i}" 
                 onkeyup="checkQuantityTextbox.this;">         
        </div>
        </section> 
    `);

    }

