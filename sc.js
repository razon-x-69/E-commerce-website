document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Men's Shirt", price: 19.99, image: "shart.jpg", category: "mens", description: "Comfortable cotton shirt." },
    { id: 2, name: "Men's Pant", price: 24.99, image: "Pant.jpg", category: "mens", description: "Stylish denim pants." },
    { id: 3, name: "Smart Watch", price: 29.99, image: "Watch.jpg", category: "mens", description: "Waterproof with multiple features." },
    { id: 4, name: "Shoe", price: 200.99, image: "Shoe.jpg", category: "mens", description: "Casual Shoe for everyone." },
    { id: 5, name: "Leather Belt", price: 15.99, image: "Belt.jpg", category: "mens", description: "Premium leather belt." },
    { id: 6, name: "Women's Dress", price: 39.99, image: "Wdress.jpg", category: "womens", description: "Elegant floral dress." },
    { id: 7, name: "Handbag", price: 49.99, image: "Handbag.jpg", category: "womens", description: "Spacious and stylish handbag." },
    { id: 8, name: "Phone Case", price: 30.99, image: "Case.jpg", category: "accessories", description: "Mobile phone Case." },
    { id: 9, name: "PowerBank", price: 100.00, image: "pBank.jpg", category: "accessories", description: "Powerbank." },
  ];

  const productList = document.getElementById("product-list");
  const cartItemsList = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderProducts(filterCategory = "all", sortPrice = "default") {
    productList.innerHTML = "";
    let filteredProducts = [...products];

    if (filterCategory !== "all") {
      filteredProducts = filteredProducts.filter(product => product.category === filterCategory);
    }

    if (sortPrice === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortPrice === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    filteredProducts.forEach((product) => {
      const productHTML = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.price.toFixed(2)}</p>
              <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
              <button class="btn btn-secondary quick-view" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#quickViewModal">Quick View</button>
            </div>
          </div>
        </div>
      `;
      productList.innerHTML += productHTML;
    });

    document.querySelectorAll(".add-to-cart").forEach(button => button.addEventListener("click", addToCart));
    document.querySelectorAll(".quick-view").forEach(button => button.addEventListener("click", openQuickView));
  }

  function addToCart(event) {
    const productId = event.target.getAttribute("data-id");
    const product = products.find((p) => p.id == productId);
    
    const cartItem = cart.find((item) => item.id == productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCart();
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      cartItemsList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
          <button class="btn btn-danger btn-sm remove-item" data-index="${index}">X</button>
        </li>
      `;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;

    document.querySelectorAll(".remove-item").forEach(button => button.addEventListener("click", removeFromCart));
  }

  function removeFromCart(event) {
    const index = event.target.getAttribute("data-index");
    cart.splice(index, 1);
    updateCart();
  }

  function openQuickView(event) {
    const productId = event.target.getAttribute("data-id");
    const product = products.find(p => p.id == productId);

    document.getElementById("quickViewTitle").textContent = product.name;
    document.getElementById("quickViewImage").src = product.image;
    document.getElementById("quickViewDescription").textContent = product.description;
    document.getElementById("quickViewPrice").textContent = product.price.toFixed(2);
  }

  document.getElementById("category-filter").addEventListener("change", (event) => {
    renderProducts(event.target.value, document.getElementById("price-sort").value);
  });

  document.getElementById("price-sort").addEventListener("change", (event) => {
    renderProducts(document.getElementById("category-filter").value, event.target.value);
  });

  renderProducts();
  updateCart();
});
