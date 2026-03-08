const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

let cart = JSON.parse(localStorage.getItem("morningGrindCart")) || [];

function renderCheckout() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = `<p class="empty-checkout">Your cart is empty.</p>`;
    checkoutTotal.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("checkout-item");

    div.innerHTML = `
      <div>
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-details">Quantity: ${item.quantity}</div>
      </div>
      <div class="checkout-item-price">$${itemTotal.toFixed(2)}</div>
    `;

    checkoutItems.appendChild(div);
  });

  checkoutTotal.textContent = total.toFixed(2);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return phone.replace(/\D/g, "").length >= 10;
}

function clearText(id) {
  document.getElementById(id).textContent = "";
}

function setText(id, message) {
  document.getElementById(id).textContent = message;
}

const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const orderMessage = document.getElementById("order-message");

  clearText("checkout-name-error");
  clearText("checkout-phone-error");
  clearText("checkout-email-error");
  orderMessage.textContent = "";

  let isValid = true;

  if (cart.length === 0) {
    orderMessage.textContent = "Add items to your cart before placing an order.";
    return;
  }

  if (!name) {
    setText("checkout-name-error", "Please enter your full name.");
    isValid = false;
  }

  if (!phone) {
    setText("checkout-phone-error", "Please enter your phone number.");
    isValid = false;
  } else if (!isValidPhone(phone)) {
    setText("checkout-phone-error", "Please enter a valid phone number.");
    isValid = false;
  }

  if (!email) {
    setText("checkout-email-error", "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setText("checkout-email-error", "Please enter a valid email address.");
    isValid = false;
  }

  if (!isValid) return;

  orderMessage.textContent = "Order placed successfully! Thank you for your order.";

  localStorage.removeItem("morningGrindCart");
  cart = [];
  renderCheckout();
  checkoutForm.reset();
});

renderCheckout();