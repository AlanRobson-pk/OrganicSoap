// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productGrid = document.getElementById("productGrid");
  const cartBtn = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();

  // Toggle dark/light mode
  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode");
  });

  // Search filter
  searchInput.addEventListener("input", () => {
    filterProducts();
  });

  // Category filter
  categoryFilter.addEventListener("change", () => {
    filterProducts();
  });

  function filterProducts() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const products = document.querySelectorAll(".product");
    products.forEach(product => {
      const name = product.dataset.name.toLowerCase();
      const cardCategory = product.closest("section").classList.contains("top-selling") ? "Top Selling" : product.dataset.category;
      const matchesSearch = name.includes(searchQuery);
      const matchesCategory = selectedCategory === "all" || selectedCategory === cardCategory;

      product.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
  }

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const name = product.querySelector("h3").textContent;
      const price = product.querySelector(".price").textContent;
      const image = product.querySelector("img").src;

      cart.push({ name, price, image });
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${name} added to cart!`);
    });
  });

  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  // Display cart page if exists
  if (document.getElementById("cartPage")) {
    const cartContainer = document.getElementById("cartItems");
    const totalAmount = document.getElementById("totalAmount");

    function renderCart() {
      cartContainer.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        const priceNumber = parseInt(item.price.replace(/[^\d]/g, ""));
        total += priceNumber;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p>${item.price}</p>
            <button data-index="${index}" class="remove-btn">Remove</button>
          </div>
        `;
        cartContainer.appendChild(div);
      });
      totalAmount.textContent = `Total: Rs ${total}`;
    }

    cartContainer.addEventListener("click", e => {
      if (e.target.classList.contains("remove-btn")) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart();
      }
    });

    document.getElementById("checkoutBtn").addEventListener("click", () => {
      alert("Checkout complete! Thank you for your purchase.");
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });

    renderCart();
  }
});
