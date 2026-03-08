// -----------------------------
// HELPERS
// -----------------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10;
}

function clearText(id) {
  document.getElementById(id).textContent = "";
}

function setText(id, message) {
  document.getElementById(id).textContent = message;
}

// -----------------------------
// CONTACT FORM
// -----------------------------
const contactForm = document.getElementById("contact-form");
const contactSuccessMessage = document.getElementById("form-success-message");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("contact-name").value.trim();
  const phone = document.getElementById("contact-phone").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  clearText("name-error");
  clearText("phone-error");
  clearText("email-error");
  clearText("message-error");
  contactSuccessMessage.textContent = "";

  let isValid = true;

  if (!name) {
    setText("name-error", "Please enter your full name.");
    isValid = false;
  }

  if (!phone) {
    setText("phone-error", "Please enter your phone number.");
    isValid = false;
  } else if (!isValidPhone(phone)) {
    setText("phone-error", "Please enter a valid phone number.");
    isValid = false;
  }

  if (!email) {
    setText("email-error", "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setText("email-error", "Please enter a valid email address.");
    isValid = false;
  }

  if (!message) {
    setText("message-error", "Please enter a message.");
    isValid = false;
  }

  if (!isValid) return;

  contactSuccessMessage.textContent = "Message sent successfully!";
  contactForm.reset();
});

// -----------------------------
// CART
// -----------------------------
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");

let cart = [];

function saveCart() {
  localStorage.setItem("morningGrindCart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("morningGrindCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function addItemToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
}

function increaseQuantity(name) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity += 1;
  }
  saveCart();
  renderCart();
}

function decreaseQuantity(name) {
  const item = cart.find(item => item.name === name);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.name !== name);
  }

  saveCart();
  renderCart();
}

function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotalElement.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
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

  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", () => increaseQuantity(btn.dataset.name));
  });

  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", () => decreaseQuantity(btn.dataset.name));
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeItem(btn.dataset.name));
  });
}

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    addItemToCart(name, price);
  });
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

// -----------------------------
// CHECKOUT FORM
// -----------------------------
const checkoutForm = document.getElementById("checkout-form");
const checkoutSuccessMessage = document.getElementById("checkout-success-message");

checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const checkoutName = document.getElementById("checkout-name").value.trim();
  const checkoutPhone = document.getElementById("checkout-phone").value.trim();
  const checkoutEmail = document.getElementById("checkout-email").value.trim();

  clearText("checkout-name-error");
  clearText("checkout-phone-error");
  clearText("checkout-email-error");
  checkoutSuccessMessage.textContent = "";

  let isValid = true;

  if (cart.length === 0) {
    checkoutSuccessMessage.textContent = "Add items to your cart before placing an order.";
    return;
  }

  if (!checkoutName) {
    setText("checkout-name-error", "Please enter your name.");
    isValid = false;
  }

  if (!checkoutPhone) {
    setText("checkout-phone-error", "Please enter your phone number.");
    isValid = false;
  } else if (!isValidPhone(checkoutPhone)) {
    setText("checkout-phone-error", "Please enter a valid phone number.");
    isValid = false;
  }

  if (!checkoutEmail) {
    setText("checkout-email-error", "Please enter your email.");
    isValid = false;
  } else if (!isValidEmail(checkoutEmail)) {
    setText("checkout-email-error", "Please enter a valid email.");
    isValid = false;
  }

  if (!isValid) return;

  checkoutSuccessMessage.textContent = "Order placed successfully!";
  cart = [];
  saveCart();
  renderCart();
  checkoutForm.reset();
});

// INIT
loadCart();
renderCart();