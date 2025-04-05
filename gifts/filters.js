function applyFilters() {
  document.getElementById("loader").style.display = "block"; // Show loader
  document.getElementById("productContainer").innerHTML = ""; // Clear old products
  window.paginatedProducts = []; // Reset pagination

  const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("categoryFilter").value.trim();
  const sortBy = document.getElementById("sortByPrice").value;

  window.filteredProducts = window.allProducts.filter(p => {
    const text = `${p.name} ${p.category}`.toLowerCase();
    
    // Match keyword (search input)
    const matchKeyword = !keyword || text.includes(keyword);

    // Match the category (either All [Main Category] or specific subcategory)
    const matchCategory =
      !selectedCategory ||
      (p.matchedSubCategories && p.matchedSubCategories.includes(selectedCategory.toLowerCase())) || 
      (selectedCategory.includes("All") && p.matchedMainCategory === selectedCategory); 

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
