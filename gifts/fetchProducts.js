function fetchProducts(page = 1) {
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  const url = `https://r2-file-server.business-harryjordan.workers.dev/products.json`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      window.allProducts = data;

      // Log for verification
      console.log(`✅ Loaded ${data.length} products`);

      // Populate dropdown *before* applying filters
      window.populateCategoryDropdown();

      // Give the DOM a tick to populate before filtering
      setTimeout(() => {
        const select = document.getElementById("categoryFilter");
        const defaultLabel = "All Womens";
        const defaultOption = Array.from(select.options).find(
          opt => opt.textContent.trim() === defaultLabel
        );

        if (defaultOption) {
          select.value = defaultOption.value;
        }

        // Apply filters
        window.applyFilters();
      }, 0);
    })
    .catch(err => {
      console.error("❌ Error fetching products:", err);
      loader.style.display = "none";
    });
}

window.fetchProducts = fetchProducts;
