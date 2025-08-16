import { products } from '../data/products.js'
import { cart, removeFromList, updateDeliveryOption, updateQuantity } from '../data/cart.js'
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm';
import { deliveryOption } from '../data/delivery.js';


//        update the html inside of the delivery options


function deliveryDateHtml(productId, deliveryId) {
  let optionHtml = ``
  const today = dayjs()
  deliveryOption.forEach((option) => {
    const deliveryDate = today.add(option.days, 'day');
    const deliveryDateFormat = deliveryDate.format("dddd, MMMM D")

    const deliveryPrice = option.price === 0 ? 'FREE' : `${((option.price / 100).toFixed(2))} -`

    const daysFromToday = option.days === 1 ? 'Tomorrow' : `${option.days} Days later`

    const isChecked = option.id === deliveryId

    optionHtml += `<div 
    class="option${option.id} js-option-radio" 

    >
            <input
              data-product-id="${productId}" 
              data-delivery-option-id="${option.id}"
              class="option-input"
              type="radio"
              ${isChecked ? 'checked' : ''}
              name="shipping-option-${productId}"
              id=""
            />
            <label class="option-info" for=""
              ><span class="date-span">${deliveryDateFormat} | ${daysFromToday}</span><br /><span
                class="price-span"
                >$${deliveryPrice} Shipping</span
              ></label
            >
          </div>`
  })
  return optionHtml
}


//      update deliveryOptionId on click



document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener('click', (event) => {
    const radio = event.target.closest(".js-option-radio")?.querySelector("input[type='radio']");
    if (radio && event.target.type === 'radio') {
      // const { productId, deliveryOptionId } = radio.dataset;
      const productId = radio.dataset.productId
      const deliveryOptionId = radio.dataset.deliveryOptionId

      updateDeliveryOption(productId, deliveryOptionId)
    }

    deliveryDateHtml()
    cartDisplayHtml()
    shippingPrice()
  });
});


//        will count and display the total amount of items in the cart


function totalQuantity() {
  let totalValue = 0;
  cart.forEach((item) => {
    totalValue += item.quantity

    document.querySelector(".js-total-header").innerHTML =
      totalValue;
    document.querySelector(".total-item-quantity").innerHTML =
      totalValue;
  })
  if (totalValue === 0) {
    document.querySelector(".js-total-header").innerHTML =
      totalValue;
    document.querySelector(".total-item-quantity").innerHTML =
      totalValue;

  }
}



totalQuantity()
cartDisplayHtml()


//        add the html inside the checkout for items inside the cart


function cartDisplayHtml() {
  let displayHtml = '';
  cart.forEach((item) => {
    const productId = item.productId;
    const deliveryId = item.deliveryOptionId
    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;

        let deliveryOptions;
        deliveryOption.forEach((option) => {
          if (option.id === item.deliveryOptionId) {
            deliveryOptions = option
          }
        })
        const today = dayjs()

        const deliveryDate = today.add(deliveryOptions.days, 'day');
        const deliveryDateFormat = deliveryDate.format("dddd, MMMM D")



        const mainHtml = `<div class="product-container js-product-id-container-${product.id}">
        <p class="delivery-time">Delivery date: ${deliveryDateFormat}</p>
        <div class="product">
          <img
            class="product-img"
            src="${product.img}"
            alt=""
          />
          <div class="product-info">
            <p class="product-name">
              ${product.name}
            </p>
            <p class="product-total-price">$${((product.price * item.quantity) / 100).toFixed(2)}</p>
            <p class="product-total-quantity">Quantity:${item.isEditing
            ? `<input type="number" class="quantity-input" value="${item.quantity}" />`
            : `<span class="quantity-display">${item.quantity}</span>`}</p>
            <button class="update-quantity" data-product-id="${product.id}">
              ${item.isSaving ? "Save" : "Update"}
            </button>
            <button class="delete-product" data-product-id="${product.id}">Delete</button>
          </div>
        </div>
        <div class="delivery-options">
          <p class="delivery-option-text">Choose a delivery option:</p>
          ${deliveryDateHtml(product.id, deliveryId)}
        </div>
      </div>`
        displayHtml += mainHtml
      }


    });

    if (matchingProduct) {
      document.querySelector(".js-all-products").innerHTML = displayHtml
    };
    orderSummary()

  });
}


//        show total price of the cart


function totalCartPrice() {
  let totalPrice = 0;
  cart.forEach((item) => {
    let matchingItem;
    products.forEach((product) => {

      if (item.productId === product.id) {
        matchingItem = product;
      }
    })
    if (matchingItem) {
      totalPrice += (matchingItem.price * item.quantity)
    }

  })
  return totalPrice
}


//       update order summary price tab


function orderSummary() {
  let totalPrice = totalCartPrice()
  let beforeTax = totalPrice + shippingPrice()
  let tax = Math.round((beforeTax / 10))

  document.querySelector(".total-item-price").innerHTML = `$${(totalPrice / 100).toFixed(2)}`;
  document.querySelector(".shipping-price").innerHTML = `$${(shippingPrice() / 100).toFixed(2)}`;
  document.querySelector(".js-tax").innerHTML = `$${beforeTax / 100}`;
  document.querySelector(".total-tax-price").innerHTML = `$${( tax / 100).toFixed(2)}`;
  document.querySelector(".order-total-price").innerHTML = `$${((tax + beforeTax) / 100).toFixed(2)}`;
}


//        interactive delete button


function deleteButtonContainer(productId) {

  removeFromList(productId)
  totalQuantity()
  document.querySelector(`.js-product-id-container-${productId}`).remove()

  console.log(cart)
  orderSummary()

}

document.addEventListener("click", function (event) {
  const btn = event.target.closest(".delete-product");
  if (!btn) return; // not a delete click

  // If it's an <a>, avoid navigation
  if (btn.tagName === "A") event.preventDefault();

  const productId = btn.dataset.productId; // expects data-product-id="123"
  if (!productId) {
    console.warn("No data-product-id on .delete-product element");
    return;
  }


  deleteButtonContainer(productId);
});


//        interactive update button
//        it will show an input to insert the new quantity


function startEditing(productId) {
  const item = cart.find((i) => String(i.productId) === String(productId));
  if (!item) return;

  item.isEditing = true;
  cartDisplayHtml(); // Show input + Save button
}

document.addEventListener("click", function (event) {
  const btn = event.target.closest(".update-quantity");
  if (!btn) return;

  event.preventDefault();

  const productId = btn.dataset.productId;
  if (!productId) return;

  const item = cart.find((i) => String(i.productId) === String(productId));
  if (!item) return;

  if (!item.isSaving) {
    // 🟢 First click: switch to Save mode
    startEditing(productId);
    item.isSaving = true;
  } else {
    // 🔵 Second click: save and switch back
    updateQuantity(productId);
    item.isSaving = false;
  }

  cartDisplayHtml(); // Re-render with updated button text
});



//            sum up all shipping prices


function shippingPrice() {
  let shippingSum = 0
  cart.forEach((item) => {
    products.forEach((product) => {
      if (item.productId === product.id) {
        deliveryOption.forEach((delivery) => {
          if (delivery.id === item.deliveryOptionId) {
            shippingSum += (delivery.price * item.quantity)
          }
        })

      }
    })
  })
  return shippingSum
}









