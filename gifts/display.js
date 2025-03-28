function displayProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

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
      window.handleImageError(p, this); // Logs and removes
    };

    const title = document.createElement("h3");
    title.textContent = p.name;

    div.appendChild(img);
    div.appendChild(title);
    container.appendChild(div);
  });
}

window.displayProducts = displayProducts;
