const grid = document.querySelector("#catalogGrid");
const tabs = document.querySelector("#categoryTabs");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");

let products = [];
let activeCategory = "Все";

const formatText = (value) => String(value || "").trim();

const productMatches = (product, query) => {
  const haystack = [product.title, product.category, product.store, product.description]
    .map(formatText)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

const renderTabs = () => {
  const categories = ["Все", ...new Set(products.map((item) => item.category))];
  tabs.innerHTML = categories
    .map((category) => `<button type="button" class="${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`)
    .join("");
};

const renderProducts = () => {
  const query = searchInput.value.trim();
  const filtered = products.filter((product) => {
    const sameCategory = activeCategory === "Все" || product.category === activeCategory;
    return sameCategory && productMatches(product, query);
  });

  grid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <a class="product-image" href="${product.link}" target="_blank" rel="nofollow sponsored noopener">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
          </a>
          <div class="product-body">
            <div class="product-meta"><span>${product.store}</span><span class="badge">${product.category}</span></div>
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="price-row">
              <span class="price">${product.price}</span>
              <a class="product-link" href="${product.link}" target="_blank" rel="nofollow sponsored noopener">Перейти</a>
            </div>
          </div>
        </article>`
    )
    .join("");

  emptyState.hidden = filtered.length !== 0;
};

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderTabs();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderTabs();
    renderProducts();
  })
  .catch(() => {
    grid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.textContent = "Не удалось загрузить products.json.";
  });
