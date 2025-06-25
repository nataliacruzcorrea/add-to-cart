// Load products from localStorage and render them in the minicart
function renderProductsFromLocalStorage(
  productContainer,
  minicartCount,
  updateTotalMinicart,
  totalPrice
) {
  const newProduct = JSON.parse(localStorage.getItem('allProducts')) || []

  newProduct.forEach((product) => {
    const productAdd = document.createElement('div')
    productAdd.classList.add('minicart-product')

    productAdd.innerHTML = `
      <img
        class="minicart-image"
        src="${product.image}"
        alt="${product.name}"
      />
      <div class="minicart-product-info">
        <span class="minicart-title">${product.name}</span>
        <div class="price-conteiner">
          <span class="installments">${product.installments}</span>
          <span>€<span class="price">${product.price}</span></span>
        </div>
        <div class="quantity-remove">
          <div class="quantity">
            <img
              class="minicart-minus"
              src="assets/icons/minus.svg"
              alt="minus"
            />
            <span class="count">${product.count}</span>
            <img
              class="minicart-plus"
              src="assets/icons/plus.svg"
              alt="plus"
            />
          </div>
          <img
            class="product-remove"
            src="assets/icons/trash-simple.svg"
            alt="remove"
          />
        </div>
      </div>
    `
    productContainer.appendChild(productAdd)
  })

  updateTotalMinicart(minicartCount)
  totalPrice()
}

export { renderProductsFromLocalStorage }
