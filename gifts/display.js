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
