window.displayProducts = function () {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  const pageProducts = paginatedProducts[currentPage - 1] || [];

  pageProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.onerror = function () {
  handleImageError(p, this); // Logs and removes
};

    const title = document.createElement("h3");
    title.textContent = p.name;

    const link = document.createElement("a");
    link.href = p.link;
    link.target = "_blank";
    link.textContent = "View Product";

    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(link);
    container.appendChild(div);
  });
}
