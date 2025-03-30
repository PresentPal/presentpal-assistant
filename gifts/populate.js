function populateCategoryDropdown() {
  const select = document.getElementById("categoryFilter");
  const previousValue = select.value;
  
  select.innerHTML = '<option value="">Filter by Category</option>';
  
  Object.entries(categoryKeywords).forEach(([main, subs]) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = main;
    
    Object.entries(subs).forEach(([sub, keywords]) => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      optGroup.appendChild(opt);
    });
    select.appendChild(optGroup);
  });

  select.value = previousValue;
}

window.populateCategoryDropdown = populateCategoryDropdown;
