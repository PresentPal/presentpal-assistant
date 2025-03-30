function paginateValidProducts() {
  const valid = filteredProducts.filter(p =>
    p.image && p.link && p.image.startsWith("http") && p.link.startsWith("http")
  );

  const pageSize = window.itemsPerPage;
  const pages = [];

  let currentPage = [];

  valid.forEach(product => {
    currentPage.push(product);
    if (currentPage.length === pageSize) {
      pages.push(currentPage);
      currentPage = [];
    }
  });

  // Push the final page if it has leftover products
  if (currentPage.length) {
    pages.push(currentPage);
  }

  window.paginatedProducts = pages;
}
window.paginateValidProducts = paginateValidProducts;