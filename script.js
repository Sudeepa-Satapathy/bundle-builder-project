const productData = [
  { id: 1, name: "Tangerine Hoodie", price: 20, img: "assets/photo-1432149877166-f75d49000351.jpg" },
  { id: 2, name: "Oversized White Coat", price: 25, img: "assets/photo-1515886657613-9f3515b0c78f.jpg" },
  { id: 3, name: "Classic Black Boots", price: 32, img: "assets/photo-1529139574466-a303027c1d8b.jpg" },
  { id: 4, name: "Street Clutch Bag", price: 18, img: "assets/photo-1588117260148-b47818741c74.jpg" },
  { id: 5, name: "Graphic Tee", price: 15, img: "assets/photo-1608748010899-18f300247112.jpg" },
  { id: 6, name: "Relaxed Joggers", price: 22, img: "assets/photo-1632149877166-f75d49000351.jpg" }
];

let selectedProducts = [];

document.querySelectorAll(".product-card").forEach(card => {
  const button = card.querySelector(".bundle-toggle");
  const id = parseInt(card.dataset.id);

  button.addEventListener("click", () => {
    const product = productData.find(p => p.id === id);
    const index = selectedProducts.findIndex(p => p.id === product.id);

    if (index >= 0) {
      // Remove product
      selectedProducts.splice(index, 1);
      button.textContent = "Add to Bundle  ";
      button.classList.remove('active');
    } else {
      selectedProducts.push(product);
      button.textContent = "Added to Bundle  ✔";
      button.classList.add('active');
    }

    updateSidebar();
  });
});

function updateSidebar() {
  const count = selectedProducts.length;
  const progressFill = document.getElementById("progress-fill");
  const progressCount = document.getElementById("progress-count");
  const discountText = document.getElementById("discount-text");
  const subtotalText = document.getElementById("subtotal-text");
  const selectedList = document.getElementById("selected-list");
  const addBtn = document.getElementById("add-bundle-btn");

  // Update progress bar and count
  progressCount.textContent = count;
  progressFill.style.width = `${(count / 3) * 100}%`;

  // Show selected products in sidebar
  selectedList.innerHTML = selectedProducts.map(p =>
    `<div><img src="${p.img}" alt="${p.name}"><span>${p.name} - $${p.price}</span></div>`
  ).join("");

  let subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  let discount = 0;

  // Apply discount if 3 or more selected
  if (count >= 3) {
    discount = subtotal * 0.3;
    discountText.textContent = `Discount: -$${discount.toFixed(2)} (30% OFF)`;
    addBtn.disabled = false;
    addBtn.classList.add("enabled");
  } else {
    discountText.textContent = ``;
    addBtn.disabled = true;
    addBtn.classList.remove("enabled");
    addBtn.textContent = "Add 3 Items to Proceed"; // Reset text if removed
  }

  subtotalText.textContent = `Subtotal: $${(subtotal - discount).toFixed(2)}`;
}


document.getElementById("add-bundle-btn").addEventListener("click", () => {
  const addBtn = document.getElementById("add-bundle-btn");

  if (selectedProducts.length >= 3) {

    // Change button text and disable it
    addBtn.textContent = "✅ Added to Cart";
    addBtn.disabled = true;
    addBtn.classList.remove("abled");
  }
});