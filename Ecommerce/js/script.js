let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  document.getElementById("cart-count").innerText = cart.length;
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div>
        ${item.name} – ₦${item.price}
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalEl.innerText = total;
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  updateCartUI();
  alert("Added to cart");
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function placeOrder(e) {
  e.preventDefault();
  alert("Order placed successfully!");
  cart = [];
  saveCart();
  updateCartUI();
  showSection("shop");
}

function handleWhatsApp() {
  const phoneNumber = "2342349166419700"; // your number (NO +)

  // 👉 CASE 1: CART EMPTY → JUST CHAT
  if (cart.length === 0) {
    const chatMessage = "Hello, I would like to make an enquiry.";
    window.open(
      'https://wa.me/2349166419700?text=${encodeURIComponent(chatMessage)}',
      "_blank"
    );
    return;
  }

  // 👉 CASE 2: CART HAS ITEMS → ORDER
  const name = prompt("Enter your full name:");
  const address = prompt("Enter delivery address:");

  if (!name || !address) {
    alert("Name and address are required to place an order.");
    return;
  }

  let message = "Hello, I would like to place an order:%0A%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message +=' ${index + 1}. ${item.name} - ₦${item.price.toLocaleString()}%0A';
    total += item.price;
  });

  message += '/nTotal: ₦${total.toLocaleString()}/n';
  message += 'Name: ${name}/n';
  message += 'Address: ${address}/n/n';
  message += "Please confirm availability. Thank you.";


  const whatsappLink =
    'https://wa.me/2349166419700?text= '+
    encodeURIComponent(message);

  window.open(whatsappLink, "_blank");

  // Auto clear cart after sending order
  cart = [];
  updateCartUI();
}

function payWithPaystack() {
  let total = cart.reduce((sum, item) => sum + item.price, 0);

  let handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxx', // REPLACE WITH YOUR PAYSTACK PUBLIC KEY
    email: 'customer@email.com',
    amount: total * 100, // kobo
    currency: "NGN",
    callback: function(response) {
      alert('Payment successful! Ref: ' + response.reference);
      cart = [];
      saveCart();
      updateCartUI();
      showSection("shop");
    },
    onClose: function() {
      alert('Payment cancelled');
    }
  });

  handler.openIframe();
}



// SHOW SECTIONS
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

// PAYMENT METHOD CHANGE
function handlePaymentChange() {
  const method = document.getElementById("paymentMethod").value;
  const bankDetails = document.getElementById("bankDetails");
  const btn = document.getElementById("placeOrderBtn");

  if (method === "bank") {
    bankDetails.style.display = "block";
    btn.disabled = false;
  } else if (method === "delivery") {
    bankDetails.style.display = "none";
    btn.disabled = false;
  } else {
    bankDetails.style.display = "none";
    btn.disabled = true;
  }
}

// COPY ACCOUNT NUMBER
function copyAccount() {
  const acct = document.getElementById("acctNumber").innerText;
  navigator.clipboard.writeText(acct);
  alert("Account number copied");
}

// PLACE ORDER → WHATSAPP
function placeOrder(e) {
  e.preventDefault();

  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const payment = document.getElementById("paymentMethod").value;

  let total = cart.reduce((sum, item) => sum + item.price, 0);

  let itemsText = cart
    .map((item, index) =>
      '${index + 1}. ${item.name} - ₦${item.price.toLocaleString()}'
    )
    .join("\n");

  let bankText = "";
  if (payment === "bank") {
    bankText =
      "\n\nBank Details:\n" +
      "Access Bank\n" +
      "ADROIT FOODS\n" +
      "1234567890\n\n" +
      "Please send payment receipt.";
  }

  const message =
`NEW ORDER

${itemsText}

Total: ₦${total.toLocaleString()}

Name: ${name}
Phone: ${phone}
Address: ${address}
Payment Method: ${payment.toUpperCase()}
${bankText}`;

  const whatsappURL =
    "https://wa.me/2349166419700?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");

  // Clear cart
  cart = [];
}
