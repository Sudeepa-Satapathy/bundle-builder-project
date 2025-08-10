// List of selected items
let selectedItems = [];

// Update right sidebar on changes
function updateSidebar() {
  const container = document.getElementById("selected-items");
  container.innerHTML = "";

  let subtotal = 0;
  let totalCount = 0;

  selectedItems.forEach(item => {
    subtotal += item.price * item.qty;
    totalCount += item.qty;

    // Selected item display box
    const box = document.createElement("div");
    box.className = "selected-item-box";

    // Left side: image, name/price, qty controls
    const leftBox = document.createElement("div");
    leftBox.className = "selected-left-box";

    // Thumbnail
    const img = document.createElement("img");
    img.src = item.img;
    img.className = "selected-thumb";

    // Info
    const infoDiv = document.createElement("div");
    infoDiv.className = "selected-info";
    infoDiv.innerHTML = `<span style="text-transform:lowercase;">${item.name}</span><br><span style="font-size:0.95em;color:#888;">$${parseFloat(item.price).toFixed(2)}</span>`;

    // Quantity controls
    const controlsDiv = document.createElement("div");
    controlsDiv.innerHTML = `
      <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
      <span class="qty">${item.qty}</span>
      <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
    `;

    leftBox.appendChild(img);
    leftBox.appendChild(infoDiv);
    leftBox.appendChild(controlsDiv);

    // Right side: cart icon
    const cartImg = document.createElement("img");
    cartImg.src = "https://cdn-icons-png.flaticon.com/128/7244/7244661.png";
    cartImg.alt = "Cart";
    cartImg.className = "cart-icon";

    // Structure: left, right
    box.appendChild(leftBox);
    box.appendChild(cartImg);
    container.appendChild(box);
  });

  // Discount
  let discountAmount = 0;
  let discountBox = document.getElementById("discount");
  if (totalCount >= 3) {
    discountAmount = subtotal * 0.3;
    discountBox.innerHTML =
      `<span class="discount-label">Discount: -$${discountAmount.toFixed(2)}</span>
      <span class="discount-percent">(30% OFF)</span>`;
  } else {
    discountBox.innerHTML = '';
  }

  // Subtotal
  document.getElementById("subtotal").textContent =
    `Subtotal: $${(subtotal - discountAmount).toFixed(2)}`;

  // Progress bar filling
  document.getElementById("progress").style.width =
    `${Math.min(100, (totalCount / 3) * 100)}%`;

  // Cart button state & text
  const cartBtn = document.getElementById("cart-btn");
  if (cartAdded) {
    cartBtn.textContent = "Added to Cart  ✔";
    cartBtn.disabled = true;
    cartBtn.classList.add("enabled");
  } else if (totalCount >= 3) {
    cartBtn.disabled = false;
    cartBtn.classList.add("enabled");
    cartBtn.textContent = "Add 3 Items to Cart";
  } else {
    cartBtn.disabled = true;
    cartBtn.classList.remove("enabled");
    cartBtn.textContent = "Add 3 Items to Cart";
  }
}

// Quantity change
function changeQty(id, change) {
  cartAdded = false; // Reset after changing qty
  const item = selectedItems.find(p => p.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) {
    selectedItems = selectedItems.filter(p => p.id !== id);
    // reset button text on product
    const btn = document.querySelector(`.product[data-id="${id}"] .add-btn`);
    if (btn) {
      btn.textContent = "Add to Bundle +";
      btn.classList.remove("active");
    }
  }
  updateSidebar();
}

// Add-to-bundle button clicks
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    cartAdded = false; // Reset cart on adding more
    const card = btn.closest(".product");
    const id = parseInt(card.dataset.id);
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const img = card.dataset.img;

    let existing = selectedItems.find(p => p.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      selectedItems.push({ id, name, price, img, qty: 1 });
    }
    btn.textContent = "Added to Bundle ✓";
    btn.classList.add("active");
    updateSidebar();
  });
});

// Cart button click
document.getElementById("cart-btn").addEventListener("click", () => {
  if (selectedItems.reduce((t, i) => t + i.qty, 0) >= 3) {
    cartAdded = true;
    // Log to console (simulate bundle added)
    console.log("BUNDLE:", selectedItems);
    updateSidebar();
  }
});

// Initial UI render
updateSidebar();

// Expose for inline onclick (on quantity buttons)
window.changeQty = changeQty;
