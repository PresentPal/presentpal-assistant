function renderPagination() {
  const pagination = document.getElementById("paginationControls");
  pagination.innerHTML = "";

  const totalPages = paginatedProducts.length;
  if (totalPages <= 1) return;

  const maxVisible = 5;

  const createButton = (label, page, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    if (disabled) btn.disabled = true;
    if (active) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = page;
      displayProducts();
      renderPagination();
    };
    return btn;
  };

  pagination.appendChild(createButton("Prev", currentPage - 1, currentPage === 1));

  const pageList = [];

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pageList.push(i);
  } else {
    pageList.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pageList.push("...");
    for (let i = start; i <= end; i++) pageList.push(i);
    if (end < totalPages - 1) pageList.push("...");
    pageList.push(totalPages);
  }

  pageList.forEach(p => {
    if (p === "...") {
      const span = document.createElement("span");
      span.textContent = "...";
      span.className = "ellipsis";
      pagination.appendChild(span);
    } else {
      pagination.appendChild(createButton(p, p, false, p === currentPage));
    }
  });

  pagination.appendChild(createButton("Next", currentPage + 1, currentPage === totalPages));
}

fetchProducts();

window.renderPagination = renderPagination;
