function paginateValidProducts() {
  // Filter for only products with valid images and links
  const valid = window.filteredProducts.filter(p => {
    const hasValidImage = p.image && p.image.startsWith("http");
    const hasValidLink = p.link && p.link.startsWith("http");

    const isValid = hasValidImage && hasValidLink;

    if (!isValid) {
      console.warn("❌ Skipping invalid product:", {
        name: p.name,
        image: p.image,
        link: p.link
      });
    }

    return isValid;
  });

  console.log(`✅ ${valid.length} valid products out of ${window.filteredProducts.length} total`);

  // Paginate the valid products
  const paginated = [];
  let page = [];

  for (let i = 0; i < valid.length; i++) {
    page.push(valid[i]);
    if (page.length === window.itemsPerPage) {
      paginated.push(page);
      page = [];
    }
  }

  // Add the final page if it has leftover items
  if (page.length > 0) {
    paginated.push(page);
  }

  window.paginatedProducts = paginated;
}

// ✅ Assign to global scope
window.paginateValidProducts = paginateValidProducts;
