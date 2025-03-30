function fetchProducts(page = 1) {
  document.getElementById("loader").style.display = "block";

  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=1&limit=48`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      window.allProducts = data;
      window.filteredProducts = data; // show as-is for quick display
      window.paginatedProducts = []; // reset
      window.populateCategoryDropdown();

      // Display unfiltered products right away
      paginateValidProducts();
      displayProducts();

      // Pre-select a default category in dropdown, but don't apply it yet
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";
        const option = Array.from(select.options).find(opt => opt.textContent === defaultLabel);
        if (option) {
          select.value = option.value;
        }
      }, 0);
    })
    .catch(err => console.error("Error fetching products:", err))
    .finally(() => {
      document.getElementById("loader").style.display = "none";
    });
}

window.fetchProducts = fetchProducts;