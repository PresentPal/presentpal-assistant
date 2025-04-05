function populateCategoryDropdown() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="">Filter by Category</option>';

  const subcategoryUsage = {};

  // Count how many products use each matchedSubCategory
  window.allProducts.forEach(p => {
    const sub = (p.matchedSubCategory || '').trim();
    if (sub) {
      subcategoryUsage[sub] = (subcategoryUsage[sub] || 0) + 1;
    }
  });

  console.log("📊 Subcategory usage:", subcategoryUsage);

  Object.entries(window.categoryKeywords).forEach(([main, subs]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = main;

     console.log(`Main Category: ${main}`);

    Object.entries(subs).forEach(([sub]) => {
      const cleanSub = sub.trim();
      if (subcategoryUsage[cleanSub]) {
        const opt = document.createElement("option");
        opt.value = cleanSub;
        opt.textContent = cleanSub;
        optGroup.appendChild(opt);
      }
    });

    // Only add group if it has options
    if (optGroup.children.length > 0) {
      select.appendChild(optGroup);
    }
  });

  // ✅ Set default after population
  const defaultCategory = "All Womens";
  const match = Array.from(select.options).find(opt =>
    opt.textContent.trim().toLowerCase() === defaultCategory.toLowerCase()
  );
  if (match) match.selected = true;

  console.log("✅ Category dropdown populated");
}

window.populateCategoryDropdown = populateCategoryDropdown;
