function displayProducts() {
  const container = document.getElementById("productContainer");
  // container.innerHTML = "";

  const pageProducts = window.paginatedProducts[window.currentPage - 1] || [];

  pageProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.style.cursor = "pointer";
    div.onclick = () => window.open(p.link, "_blank");

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.onerror = function () {
      window.handleImageError(p, this);
    };

    const title = document.createElement("h3");
    title.textContent = p.name;
    title.style.margin = "10px 0 4px";
    
    const merchant = document.createElement("p");
    merchant.className = "merchant";
    merchant.textContent = p.merchant || "";
    merchant.style.color = "#888";
    merchant.style.fontSize = "13px";
    merchant.style.margin = "0 0 4px";

    const price = document.createElement("p");
    price.className = "price";
    if (p.price && typeof p.price === "string" && p.price.startsWith("GBP")) {
      price.textContent = "£" + p.price.replace("GBP", "");
    } else {
      price.textContent = p.price || "";
    }
    price.style.color = "#404040";
    price.style.margin = "0";
    price.style.fontSize = "14px";

    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(merchant);
    div.appendChild(price);
    container.appendChild(div);
  });
}

window.displayProducts = displayProducts;