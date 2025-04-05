function applyFilters() {
  document.getElementById("loader").style.display = "block"; // Show loader
  document.getElementById("productContainer").innerHTML = ""; // Clear old products
  window.paginatedProducts = []; // Reset pagination

  const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("categoryFilter").value.trim();
  const sortBy = document.getElementById("sortByPrice").value;

  window.filteredProducts = window.allProducts.filter(p => {
    const text = `${p.name} ${p.category}`.toLowerCase();

    // Match by keyword (product name or category)
    const matchKeyword = !keyword || text.includes(keyword);

    // Match by main category (compare selected main category with the matched main category)
    const matchCategory = 
      !selectedCategory ||
      p.matchedMainCategory === selectedCategory ||  // Match the main category
      p.matchedSubCategories.some(subCategory =>
        subCategory.toLowerCase() === selectedCategory.toLowerCase() // Match any subcategory
      );

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
