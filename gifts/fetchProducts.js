function fetchProducts(page = 1) {
  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=${page}&limit=${window.itemsPerPage}`;
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

console.log("✅ Products fetched:", data);
console.log("Example product category:", data[0]?.category);
