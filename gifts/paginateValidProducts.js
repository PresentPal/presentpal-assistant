function paginateValidProducts() {
  const valid = filteredProducts.filter(p =>
    p.image && p.link && p.image.startsWith("http") && p.link.startsWith("http")
  );

  const pageSize = window.itemsPerPage;
  const pages = [];
  let page = [];

  for (const product of valid) {
    page.push(product);
    if (page.length === pageSize) {
      pages.push(page);
      page = [];
    }
  }

  if (page.length) {
    pages.push(page); // final smaller page
  }

  window.paginatedProducts = pages;
}
window.paginateValidProducts = paginateValidProducts;