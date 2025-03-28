function populateCategoryDropdown() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="">Filter by Category</option>';
  Object.entries(categoryKeywords).forEach(([main, subs]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = main;
    Object.entries(subs).forEach(([sub, keywords]) => {
      const opt = document.createElement("option");
      opt.value = keywords[0];
      opt.textContent = sub;
      optGroup.appendChild(opt);
    });
    select.appendChild(optGroup);
  });
}

window.populateCategoryDropdown = populateCategoryDropdown;
