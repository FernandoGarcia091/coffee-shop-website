const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");

let cart = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("morningGrindCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("morningGrindCart", JSON.stringify(cart));
}

// Add item to cart
function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
}

// Increase quantity
function increaseQuantity(name) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += 1;
    saveCart();
    renderCart();
  }
}

// Decrease quantity
function decreaseQuantity(name) {
  const item = cart.find((item) => item.name === name);

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.name !== name);
  }

  saveCart();
  renderCart();
}

// Remove item completely
function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  saveCart();
  renderCart();
}

// Render cart
function renderCart() {
  if (!cartItemsContainer || !cartTotalElement) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotalElement.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
      </div>

      <div class="cart-controls">
        <div class="quantity-controls">
          <button class="qty-btn decrease-btn" data-name="${item.name}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn increase-btn" data-name="${item.name}">+</button>
        </div>

        <button class="remove-btn" data-name="${item.name}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = total.toFixed(2);

  // Re-bind quantity buttons
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", () => {
      increaseQuantity(button.dataset.name);
    });
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", () => {
      decreaseQuantity(button.dataset.name);
    });
  });

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      removeItem(button.dataset.name);
    });
  });
}

// Add-to-cart button listeners
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    addItemToCart(name, price);
  });
});

// Clear cart button
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

// Initialize
loadCart();
renderCart();