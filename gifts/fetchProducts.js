function fetchProducts(page = 1) {
  // Show the loader while fetching
  document.getElementById("loader").style.display = "block";

  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=${page}&limit=100`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      window.allProducts = data;
      window.populateCategoryDropdown();

      // Delay setting default category until dropdown is populated
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";
        const option = Array.from(select.options).find(opt => opt.textContent === defaultLabel);
        if (option) {
          select.value = option.value;
        }

        window.applyFilters();
      }, 0);
    })
    .catch(err => console.error("Error fetching products:", err))
    .finally(() => {
      // Always hide the loader after fetch attempt finishes
      document.getElementById("loader").style.display = "none";
    });
}

window.fetchProducts = fetchProducts;