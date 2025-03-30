function paginateValidProducts() {
  const valid = window.validPool.filter(p => {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;

    const text = `${p.name} ${p.category}`;
    const matchKeyword = !keyword || text.toLowerCase().includes(keyword);

    let matchCategory = true;
    if (selectedCategory) {
      let matchedKeywords = [];

      Object.values(window.categoryKeywords).forEach(group => {
        Object.entries(group).forEach(([label, keywords]) => {
          if (label === selectedCategory) {
            matchedKeywords = keywords;
          }
        });
      });

      matchCategory = matchedKeywords.some(keyword =>
        p.category && p.category.includes(keyword)
      );
    }

    return matchKeyword && matchCategory;
  });

  window.paginatedProducts = [];
  for (let i = 0; i < valid.length; i += window.itemsPerPage) {
    const page = valid.slice(i, i + window.itemsPerPage);
    window.paginatedProducts.push(page);
  }
}

window.paginateValidProducts = paginateValidProducts;