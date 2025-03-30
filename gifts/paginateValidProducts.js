function paginateValidProducts() {
  const valid = filteredProducts.filter(p =>
    p.image && p.link &&
    p.image.startsWith("http") &&
    p.link.startsWith("http")
  );

  window.paginatedProducts = [];
  let currentIndex = 0;

  while (currentIndex < valid.length) {
    const page = valid.slice(currentIndex, currentIndex + window.itemsPerPage);
    window.paginatedProducts.push(page);
    currentIndex += page.length;
  }
}

window.paginateValidProducts = paginateValidProducts;