import { products } from '../data/products.js';
import { cart, addToCart } from '../data/cart.js';


// Initialize htmlDisplay outside the loop
let htmlDisplay = '';
// export const cart = JSON.parse(localStorage.getItem("cart")) || []
// export let storageCart = JSON.parse(localStorage.getItem("cart"))


totalCartQuantity()

function totalCartQuantity() {
    let totalValue = 0;

    cart.forEach((item) => {
        document.querySelector(".product-quantity").innerHTML =
            (totalValue += item.quantity);
    })
}

products.forEach((product) => {

    function nameLength() {
        let productName = product.name;
        if (productName.length < 29) {
            productName += '<br><br>';
        }
        return productName;
    }

    const htmlText = `<div class="product-group">
            <img class="product-img" src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <p class="product-name limit-text-to-2-lines">${nameLength()}</p>
                <div class="rating-container">
                    <img class="product-rate" src="images/ratings/rating-${product.rating.ratingStar * 10}.png" alt="">
                    <p class="product-rate-value">${product.rating.ratingNumber}</p>
                </div>
                <p class="product-price">$${(product.price / 100).toFixed(2)}</p>
                <select name="" class="number-of-product">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                <div class="add-item-container"></div>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>   
            </div>
        </div>`;
    htmlDisplay += htmlText;
});

// Set the innerHTML once after the loop
document.querySelector(".product-body").innerHTML = htmlDisplay;


//         for added item


document.querySelectorAll(".add-to-cart").forEach((item) => {
    item.addEventListener("click", function () {
        // Find the closest .add-item-container relative to the clicked button
        const container = this.closest(".product-info").querySelector(".add-item-container");

        // Set the content for this specific container
        container.innerHTML = `
            <img class="check-img" src="https://supersimple.dev/projects/amazon/images/icons/checkmark.png" alt="">
            <p class="js-product-item-status item-added">Added</p>
        `;
        container.classList.add("show")
        setTimeout(() => {
            container.classList.remove("show");
            // Wait for the transition to finish before clearing content
            setTimeout(() => {
                container.innerHTML = "";
            }, 300); // Match the transition duration (0.3s)
        }, 2000); // Display duration
    });
});


//          for adding item into a list in cart.js 
//          then adding it to cart page



document.querySelectorAll(".add-to-cart").forEach((item) => {
    item.addEventListener("click", function () {
        let productContainer = this.closest(".product-info");
        let selectedValue = productContainer.querySelector(".number-of-product").value;
        selectedValue = parseInt(selectedValue) || 0;
        const productId = item.dataset.productId
        addToCart(productId, selectedValue)
        productContainer.querySelector(".number-of-product").value = 1;
        totalCartQuantity()

        console.log(cart)

    })
})



//          for product quantity number
//          no need for that because of the above code


// let totalValue = 0;
// document.querySelectorAll(".add-to-cart").forEach((item) => {
//     item.addEventListener("click", function () {
//         let productContainer = this.closest(".product-info");
//         let selectedValue = productContainer.querySelector(".number-of-product").value;
//         selectedValue = parseInt(selectedValue) || 0;
//         document.querySelector(".product-quantity").innerHTML = (totalValue += selectedValue)
//         productContainer.querySelector(".number-of-product").value = 1;
//     })
// })







