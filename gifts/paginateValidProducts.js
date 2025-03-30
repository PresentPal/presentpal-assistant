function paginateValidProducts() {
  const valid = window.filteredProducts.filter(
    p => p.image && p.link && p.image.startsWith("http") && p.link.startsWith("http")
  );

  const paginated = [];
  let page = [];

  valid.forEach(product => {
    page.push(product);
    if (page.length === window.itemsPerPage) {
      paginated.push(page);
      page = [];
    }
  });

  // Push any remaining products to the last page
  if (page.length > 0) {
    paginated.push(page);
  }

  window.paginatedProducts = paginated;
}
window.paginateValidProducts = paginateValidProducts;