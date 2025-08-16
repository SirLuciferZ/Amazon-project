export let cart = JSON.parse(localStorage.getItem("cart"))

if (!cart) {
    cart = [
        {
            productId: '111111',
            quantity: 9,
            deliveryOptionId: '2'
        },
        {
            productId: '111112',
            quantity: 13,
            deliveryOptionId: '1'
        },
        {
            productId: '111113',
            quantity: 8,
            deliveryOptionId: '1'
        }
    ]
}


//          save items from cart in local storage


export function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart))
}


//          remove item from cart


export function removeFromList(productId) {
    let index = cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1); // Remove 1 item at the found index
    }
    saveToStorage()
}


//          add item to cart


export function addToCart(productId, selectedValue) {

    let matchingItem;
    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += selectedValue
    } else {
        cart.push({
            productId: productId,
            quantity: selectedValue,
            deliveryOptionId: '1'
        })
    }
    saveToStorage();
}


//          update delivery Options


export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId


    saveToStorage()

}


// export function updateQuantity(productId, newQuantity) {
//     let matchingItem;
//     cart.forEach((item) => {
//         if (productId === item.productId) {
//             matchingItem = item;
//         }
//     });
//     matchingItem.quantity = newQuantity


// }

export function updateQuantity(productId) {
  const item = cart.find((i) => String(i.productId) === String(productId));
  if (!item) return;

  const inputEl = document.querySelector(
    `.item-row[data-product-id="${productId}"] .quantity-input`
  );

  if (!inputEl) return;

  const newQuantity = parseInt(inputEl.value, 10);
  if (!isNaN(newQuantity)) {
    item.quantity = newQuantity;
  }

  item.isEditing = false;
}
