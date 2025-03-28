function fetchProducts(page = 1) {
  const url = `https://.../products.json?page=${page}&limit=${window.itemsPerPage}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      populateCategoryDropdown();
      applyFilters();
    })
    .catch(err => console.error("Error fetching products:", err));
}

window.fetchProducts = fetchProducts;
