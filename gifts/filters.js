function applyFilters() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  // ⛔ Prevent applying filters without a selected category
  if (!selectedCategory) {
    filteredProducts = [];
    paginatedProducts = [];
    displayProducts();
    renderPagination();
    return;
  }

  let matchedKeywords = [];

  // Find keywords for the selected category label
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

  currentPage = 1;
  paginateValidProducts();
  displayProducts();
  renderPagination();
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);

window.applyFilters = applyFilters;