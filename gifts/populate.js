function populateCategoryDropdown() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="">Filter by Category</option>';

  Object.entries(window.categoryKeywords).forEach(([main, subs]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = main;

    Object.entries(subs).forEach(([sub, keywords]) => {
      const opt = document.createElement("option");
      opt.value = label; // Use subcategory label as the value
      opt.textContent = label;
      optGroup.appendChild(opt);
    });

    select.appendChild(optGroup);
  });

  // ✅ Set default after population
  const defaultCategory = "All Womens";
  const match = Array.from(select.options).find(opt => opt.textContent === defaultCategory);
  if (match) match.selected = true;
}

window.populateCategoryDropdown = populateCategoryDropdown;
