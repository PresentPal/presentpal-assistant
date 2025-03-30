function fetchProducts(page = 1) {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=1&limit=48`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      window.allProducts = data;
      window.populateCategoryDropdown();

      // ✅ Show first 48 products unfiltered immediately
      window.filteredProducts = data;
      window.paginatedProducts = [data]; // Just one page
      window.displayProducts();

      loader.style.display = "none"; // Hide loader quickly

      // ⏳ Then apply default filters after slight delay
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";
        const option = Array.from(select.options).find(opt => opt.textContent === defaultLabel);
        if (option) {
          select.value = option.value;
        }
        window.applyFilters(); // this will re-render
      }, 100);
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      loader.style.display = "none";
    });
}

window.fetchProducts = fetchProducts;