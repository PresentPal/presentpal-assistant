function fetchProducts(page = 1) {
  // Show loader early
  document.getElementById("loader").style.display = "block";

  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=1&limit=48`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      window.allProducts = data;
      window.populateCategoryDropdown();

      // Wait for dropdown to populate
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";
        const option = Array.from(select.options).find(opt => opt.textContent === defaultLabel);
        if (option) {
          select.value = option.value;
        }

        // Now apply filters — loader will be hidden there
        window.applyFilters();
      }, 0);
    })
    .catch(err => console.error("Error fetching products:", err));
}

window.fetchProducts = fetchProducts;