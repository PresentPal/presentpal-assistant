function displayProducts() {
  const container = document.getElementById("productContainer");
  const pageProducts = window.paginatedProducts[window.currentPage - 1] || [];

  console.log(`🛒 Displaying page ${window.currentPage} with ${pageProducts.length} products`);

  pageProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.style.cursor = "pointer";
    div.onclick = () => window.open(p.link, "_blank");

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name || "Product image";
    img.onerror = function () {
      window.handleImageError?.(p, this);
    };

    const title = document.createElement("h3");
    title.textContent = p.name || "Unnamed Product";

    const merchant = document.createElement("p");
    merchant.className = "merchant";
    merchant.textContent = p.merchant || "";

    const price = document.createElement("p");
    price.className = "price";

    if (p.price && typeof p.price === "string" && p.price.startsWith("GBP")) {
      price.textContent = "£" + p.price.replace("GBP", "").trim();
    } else {
      price.textContent = p.price || "";
    }

    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(merchant);
    div.appendChild(price);

    container.appendChild(div);
  });

  if (pageProducts.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-results";
    msg.textContent = "No products to display.";
    container.appendChild(msg);
  }
}

window.displayProducts = displayProducts;
