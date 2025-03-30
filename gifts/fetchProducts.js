window.validPool = [];
window.backendPage = 1;
window.fetching = false;

window.fetchProducts = async function fetchProducts() {
  if (window.fetching) return;
  window.fetching = true;

  try {
    const url = `https://evening-basin-64817-f38e98d8c5e2.herokuapp.com/products.json?page=${window.backendPage}&limit=${window.itemsPerPage}`;
    const res = await fetch(url);
    const data = await res.json();

    // Save all products (not just valid ones)
    window.allProducts = window.allProducts.concat(data);

    // Filter for valid ones
    const valid = data.filter(p =>
      p.image && p.link &&
      p.image.startsWith("http") &&
      p.link.startsWith("http")
    );

    window.validPool.push(...valid);
    window.backendPage++;

    // Keep fetching until we have at least 24 valid products or no more data
    if (window.validPool.length >= window.itemsPerPage || data.length < window.itemsPerPage) {
      populateCategoryDropdown();
      applyFilters(); // This will trigger paginateValidProducts + display
    } else {
      fetchProducts(); // Keep fetching more
    }

  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    window.fetching = false;
  }
};