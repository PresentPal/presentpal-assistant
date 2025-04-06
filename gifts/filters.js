function applyFilters() {
  document.getElementById("loader").style.display = "block"; // Show loader
  document.getElementById("productContainer").innerHTML = ""; // Clear old products
  window.paginatedProducts = []; // Reset pagination

  const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("categoryFilter").value.trim().toLowerCase(); // Convert to lowercase
  const sortBy = document.getElementById("sortByPrice").value;

  window.filteredProducts = window.allProducts.filter(p => {
    const text = `${p.name} ${p.category}`.toLowerCase();

    // Check if the product name matches the keyword
    const matchKeyword = !keyword || text.includes(keyword);

    // Check if the product's matchedSubCategory includes the selected category
    const matchCategory =
      !selectedCategory || 
      (p.matchedSubCategories && p.matchedSubCategories.some(subCategory => subCategory.toLowerCase() === selectedCategory));

    return matchKeyword && matchCategory;
  });

  console.log(`🔍 Found ${window.filteredProducts.length} filtered products`);
  console.log("📂 Selected category:", selectedCategory);

  // Shuffle products by default
  for (let i = window.filteredProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [window.filteredProducts[i], window.filteredProducts[j]] = [
      window.filteredProducts[j],
      window.filteredProducts[i]
    ];
  }

  // Sort by price if selected
  if (sortBy === "asc" || sortBy === "desc") {
    window.filteredProducts.sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/[^\d.]/g, ""));
      const priceB = parseFloat((b.price || "0").replace(/[^\d.]/g, ""));
      return sortBy === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  if (!selectedCategory || window.filteredProducts.length === 0) {
    document.getElementById("loader").style.display = "none";
    return;
  }

  paginateValidProducts();
  displayProducts();

  document.getElementById("loader").style.display = "none"; // Hide loader
}

// 🔌 Event listeners
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortByPrice").addEventListener("change", applyFilters);

// 🌍 Expose globally
window.applyFilters = applyFilters;
