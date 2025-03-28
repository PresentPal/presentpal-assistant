function applyFilters() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  filteredProducts = allProducts.filter(p => {
    const text = `${p.name} ${p.category}`;
    const matchKeyword = !keyword || text.toLowerCase().includes(keyword);
    let matchCategory = true;

    if (selectedCategory) {
      // Flatten all categories into one big mapping: "Gifts For Him" ➜ all keywords
      let matchedKeywords = [];

      Object.values(window.categoryKeywords).forEach(group => {
        Object.entries(group).forEach(([label, keywords]) => {
          if (label === selectedCategory) {
            matchedKeywords = keywords;
          }
        });
      });

      console.log("Selected category:", selectedCategory);
      console.log("Keywords to match:", matchedKeywords);

      matchCategory = matchedKeywords.some(keyword =>
        p.category && p.category.includes(keyword)
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

let paginatedProducts = [];
window.applyFilters = applyFilters;

