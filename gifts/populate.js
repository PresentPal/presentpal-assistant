function populateCategoryDropdown() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="">Filter by Category</option>';

  const subcategoryUsage = {};

  // Count how many products exist in each subcategory
  window.allProducts.forEach(p => {
    const sub = (p.matchedSubCategory || '').trim();
    if (sub) {
      subcategoryUsage[sub] = (subcategoryUsage[sub] || 0) + 1;
    }
  });

  Object.entries(window.categoryKeywords).forEach(([main, subs]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = main;

    Object.entries(subs).forEach(([sub]) => {
      const cleanSub = sub.trim();
      if (subcategoryUsage[cleanSub]) {
        const option = document.createElement("option");
        option.value = cleanSub;
        option.textContent = cleanSub;
        optGroup.appendChild(option);
      }
    });

    // Add group only if it contains visible subcategories
    if (optGroup.children.length > 0) {
      select.appendChild(optGroup);
    }
  });

  // ✅ Set default category if available
  const defaultCategory = "All Womens";
  const match = Array.from(select.options).find(opt => opt.textContent === defaultCategory);
  if (match) match.selected = true;
}

window.populateCategoryDropdown = populateCategoryDropdown;
