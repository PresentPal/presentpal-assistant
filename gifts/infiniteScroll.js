let loading = false;

function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.offsetHeight;

  if (
    scrollY >= pageHeight - 300 &&
    !loading &&
    window.currentPage < window.paginatedProducts.length
  ) {
    loading = true;
    showSpinner();

    setTimeout(() => {
      window.currentPage += 1;
      window.displayProducts();
      hideSpinner();
      loading = false;
    }, 500);
  }
});