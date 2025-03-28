function paginateValidProducts() {
  const valid = filteredProducts.filter(p =>
    p.image && p.link && p.image.startsWith("http") && p.link.startsWith("http")
  );

  paginatedProducts = [];
  for (let i = 0; i < valid.length; i += itemsPerPage) {
    const page = valid.slice(i, i + itemsPerPage);
    if (page.length === itemsPerPage || i + itemsPerPage >= valid.length) {
      paginatedProducts.push(page);
    } else {
      const remaining = valid.length - i;
      paginatedProducts.push(valid.slice(i)); // final smaller page
      break;
    }
  }
}

window.paginateValidProducts = paginateValidProducts;
