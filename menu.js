const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");

let cart = [];

function loadCart() {
  try {
    const savedCart = localStorage.getItem("morningGrindCart");
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("morningGrindCart", JSON.stringify(cart));
}

function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function increaseQuantity(name) {
  const item = cart.find((item) => item.name === name);
  if (!item) return;

  item.quantity += 1;
  saveCart();
  renderCart();
}

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

function removeItem(name) {
  cart = cart.filter((item) => item.name !== name);
  saveCart();
  renderCart();
}

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
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
      </div>
      <div class="cart-controls">
        <div class="quantity-controls">
          <button type="button" class="qty-btn decrease-btn" data-name="${item.name}">-</button>
          <span>${item.quantity}</span>
          <button type="button" class="qty-btn increase-btn" data-name="${item.name}">+</button>
        </div>
        <button type="button" class="remove-btn" data-name="${item.name}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  cartTotalElement.textContent = total.toFixed(2);
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    addItemToCart(name, price);
  });
});

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const target = event.target;
    const name = target.dataset.name;

    if (!name) return;

    if (target.classList.contains("increase-btn")) {
      increaseQuantity(name);
    }

    if (target.classList.contains("decrease-btn")) {
      decreaseQuantity(name);
    }

    if (target.classList.contains("remove-btn")) {
      removeItem(name);
    }
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
}

loadCart();
renderCart();