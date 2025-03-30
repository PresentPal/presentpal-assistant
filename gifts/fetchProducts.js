function fetchProducts(page = 1) {
  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=${page}&limit=${window.itemsPerPage}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      window.allProducts = data;
      window.populateCategoryDropdown(); // populate first

      // Wait a moment for DOM to update, then set default
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";

        const option = Array.from(select.options).find(opt => opt.textContent === defaultLabel);
        if (option) {
          select.value = option.value;
        }

        window.applyFilters(); // Trigger filters
      }, 0); // delay until dropdown is populated
    })
    .catch(err => console.error("Error fetching products:", err));
}

window.fetchProducts = fetchProducts;