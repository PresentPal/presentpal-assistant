function applyFilters() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  filteredProducts = allProducts.filter(p => {
    const text = `${p.name} ${p.category}`;
    const matchKeyword = !keyword || text.toLowerCase().includes(keyword);
    const matchCategory = !selectedCategory || (p.category && p.category.includes(selectedCategory));
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
