function applyFilters() {
  document.getElementById("loader").style.display = "block"; // Show loader
  document.getElementById("productContainer").innerHTML = ""; // Clear old products
  window.paginatedProducts = []; // Reset pagination

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortByPrice").value;

  filteredProducts = window.allProducts.filter(p => {
  const text = `${p.name} ${p.category}`;
  const matchKeyword = !keyword || text.toLowerCase().includes(keyword);

  const matchCategory =
    !selectedCategory || p.matchedSubCategory === selectedCategory;

  return matchKeyword && matchCategory;
});

  // Shuffle by default
  for (let i = filteredProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
  }

  // Sort by price if selected
  if (sortBy === "asc" || sortBy === "desc") {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, ""));
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, ""));
      return sortBy === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  // ✅ Don't render if no category selected or if nothing matched
  if (!selectedCategory || filteredProducts.length === 0) {
    document.getElementById("loader").style.display = "none";
    return;
  }

  paginateValidProducts();
  displayProducts();

  document.getElementById("loader").style.display = "none"; // Hide loader
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortByPrice").addEventListener("change", applyFilters);

window.applyFilters = applyFilters;
