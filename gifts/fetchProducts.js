window.fetchProducts = function (page = 1) {
  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=${page}&limit=${itemsPerPage}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      populateCategoryDropdown();
      applyFilters();
    })
    .catch(err => console.error("Error fetching products:", err));
}
