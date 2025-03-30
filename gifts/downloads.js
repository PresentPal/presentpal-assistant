// Expose broken products array globally
window.brokenProducts = [];

// Handle image errors and log broken products
window.handleImageError = function(product, element) {
  if (!window.brokenProducts.find(p => p.name === product.name)) {
    window.brokenProducts.push(product);
  }
  element.closest(".product")?.remove();
};

// Download broken products as JSON
window.downloadBrokenProducts = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
    JSON.stringify(window.brokenProducts, null, 2)
  );
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", "broken-products.json");
  a.click();
};

// Download unmatched categories as .txt
window.downloadUnmappedCategories = function() {
  const usedCategories = new Set((window.allProducts || []).map(p => p.category).filter(Boolean));
  const mappedCategories = new Set();

  Object.values(window.categoryKeywords || {}).forEach(main => {
    Object.values(main).forEach(subs => {
      subs.forEach(cat => mappedCategories.add(cat));
    });
  });

  const unmatched = Array.from(usedCategories).filter(cat =>
    !Array.from(mappedCategories).some(mapped => cat.includes(mapped))
  );

  if (unmatched.length === 0) {
    alert("✅ All categories appear to be mapped!");
    return;
  }

  const blob = new Blob([unmatched.sort().join('\n')], {
    type: "text/plain;charset=utf-8"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "unmapped_categories.txt";
  link.click();
};

// Inject button + hook up listeners when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Download Unmapped Button
  const unmappedBtn = document.getElementById("downloadUnmapped");
  if (unmappedBtn) {
    unmappedBtn.addEventListener("click", window.downloadUnmappedCategories);
  }

  // Download Broken Products Button
  // const brokenBtn = document.createElement("button");
  // brokenBtn.textContent = "📦 Download Broken Products";
  // brokenBtn.style.cssText =
   // "margin: 20px auto; display: block; padding: 10px 15px; background-color: crimson; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;";
  // brokenBtn.onclick = window.downloadBrokenProducts;

  const insertTarget = document.getElementById("productContainer");
  if (insertTarget) {
    document.body.insertBefore(brokenBtn, insertTarget);
  }
});
