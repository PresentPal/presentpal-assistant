function applyFilters() {
  const loader = document.getElementById("loader");
  const container = document.getElementById("productContainer");

  loader.style.display = "block";
  container.innerHTML = "";
  window.paginatedProducts = [];
  window.filteredProducts = [];

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortByPrice").value;

  window.filteredProducts = window.allProducts.filter(p => {
    const text = `${p.name || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
    const matchKeyword = !keyword || text.includes(keyword);

    const productSub = (p.matchedSubCategory || '').trim().toLowerCase();
    const selected = selectedCategory.trim().toLowerCase();
    const matchCategory = !selectedCategory || productSub === selected;

    return matchKeyword && matchCategory;
  });

  // Shuffle results
  for (let i = window.filteredProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [window.filteredProducts[i], window.filteredProducts[j]] = [window.filteredProducts[j], window.filteredProducts[i]];
  }

  // Sort by price if needed
  if (sortBy === "asc" || sortBy === "desc") {
    window.filteredProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, ""));
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, ""));
      return sortBy === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  // Prevent empty category rendering
  if (!selectedCategory || window.filteredProducts.length === 0) {
    loader.style.display = "none";
    return;
  }

  paginateValidProducts();
  displayProducts();

  loader.style.display = "none";
}

// Attach listeners
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortByPrice").addEventListener("change", applyFilters);

// Global access
window.applyFilters = applyFilters;
