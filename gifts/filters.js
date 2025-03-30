function applyFilters() {
  document.getElementById("loader").style.display = "block"; // Show loader

  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const sortBy = document.getElementById("sortByPrice").value;

  if (!selectedCategory) {
    filteredProducts = [];
    paginatedProducts = [];
    displayProducts();
    // renderPagination(); // ⛔ Hide pagination when no category selected
    document.getElementById("loader").style.display = "none";
    return;
  }

  let matchedKeywords = [];

  Object.values(window.categoryKeywords).forEach(group => {
    Object.entries(group).forEach(([label, keywords]) => {
      if (label === selectedCategory) {
        matchedKeywords = keywords;
      }
    });
  });

  filteredProducts = allProducts.filter(p => {
    const text = `${p.name} ${p.category}`;
    const matchKeyword = !keyword || text.toLowerCase().includes(keyword);

    let matchCategory = true;

    if (matchedKeywords.length) {
      matchCategory = matchedKeywords.some(kw =>
        p.category && p.category.includes(kw)
      );
    }

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

  // currentPage = 1; // ⛔ Not needed for infinite scroll
  paginateValidProducts();
  displayProducts();
  // renderPagination(); // ⛔ Hide pagination controls

  document.getElementById("loader").style.display = "none"; // Hide loader
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sortByPrice").addEventListener("change", applyFilters);

window.applyFilters = applyFilters;