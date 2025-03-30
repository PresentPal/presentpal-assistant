function paginateValidProducts() {
  // Filter for only products with valid images and links
  const valid = window.filteredProducts.filter(
    p => p.image && p.link && p.image.startsWith("http") && p.link.startsWith("http")
  );

  const paginated = [];
  let page = [];

  for (let i = 0; i < valid.length; i++) {
    page.push(valid[i]);
    if (page.length === window.itemsPerPage) {
      paginated.push(page);
      page = [];
    }
  }

  // Add remaining products to the final page (if any)
  if (page.length > 0) {
    paginated.push(page);
  }

  window.paginatedProducts = paginated;
}

window.paginateValidProducts = paginateValidProducts;