// minicart functions
function openMinicart(minicart, overflow, minicartCount) {
  minicart.classList.add('open')
  overflow.classList.add('open')
  attachQuantityListeners(minicartCount)
}

function closeMinicart(minicart, overflow) {
  minicart.classList.remove('open')
  overflow.classList.remove('open')
}

// add to cart
function addToCart(
  e,
  minicart,
  overflow,
  minicartCount,
  productContainer,
  totalPrice,
  updateTotalMinicart
) {
  const selectProduct = e.target.parentElement
  const productImage = selectProduct.querySelector('.product-image').src
  const productName = selectProduct.querySelector('.product-name').innerText
  const productPrice = selectProduct.querySelector('.product-price').innerText
  const productInstallments = selectProduct.querySelector(
    '.product-installments'
  ).innerText

  let itemExist = false

  const name = document.querySelectorAll('.minicart-title')
  name.forEach((item) => {
    if (productName.toUpperCase() == item.innerText) {
      itemExist = true

      const quantityCount = item.parentElement.querySelector(
        '.quantity-remove .quantity .count'
      )

      let count = Number(quantityCount.innerText) + 1
      quantityCount.innerText = count
    }
  })

  if (!itemExist) {
    const productAdd = document.createElement('div')
    productAdd.classList.add('minicart-product')

    productAdd.innerHTML = `
      <img
        class="minicart-image"
        src="${productImage}"
        alt="${productName}"
      />
      <div class="minicart-product-info">
        <span class="minicart-title">${productName}</span>
        <div class="price-conteiner">
          <span class="installments">${productInstallments}</span>
          <span class="euro">€<span class="price">${productPrice}</span></span>
        </div>
        <div class="quantity-remove">
          <div class="quantity">
            <img
              class="minicart-minus"
              src="assets/icons/minus.svg"
              alt="minus"
            />
            <span class="count">1</span>
            <img 
              class="minicart-plus"
              src="assets/icons/plus.svg"
              alt="plus"
            />
          </div>
          <img
            class="product-remove"
            src="assets/icons/trash-simple.svg"
            alt="Remove"
          />
        </div>
      </div>
    `

    productContainer.append(productAdd)

    // add item to localStorage
    const items = {
      image: productImage,
      name: productName,
      installments: productInstallments,
      price: productPrice,
      count: 1,
    }

    const cart = JSON.parse(localStorage.getItem('allProducts')) || []
    cart.push(items)
    localStorage.setItem('allProducts', JSON.stringify(cart))
  }

  totalPrice()
  openMinicart(minicart, overflow, minicartCount)
  updateTotalMinicart(minicartCount)
}

// quantity control
function attachQuantityListeners(minicartCount) {
  const incrementBtn = document.querySelectorAll('.minicart-plus')
  const decrementBtn = document.querySelectorAll('.minicart-minus')
  const removeIcon = document.querySelectorAll('.product-remove')

  incrementBtn.forEach((btn) =>
    btn.addEventListener('click', (e) => incrementProduct(e, minicartCount))
  )
  decrementBtn.forEach((btn) =>
    btn.addEventListener('click', (e) => decrementProduct(e, minicartCount))
  )
  removeIcon.forEach((item) =>
    item.addEventListener('click', (e) => productRemove(e, minicartCount))
  )
}

function incrementProduct(e) {
  const btnIncrement = e.target
  const countContainer = btnIncrement.parentElement.querySelector('.count')
  const quantityCount = btnIncrement.parentElement.querySelector('.count')
  const productName = quantityCount
    .closest('.minicart-product-info')
    .querySelector('.minicart-title').innerText

  const count = Number(quantityCount.innerText) + 1
  countContainer.innerText = count

  const cart = JSON.parse(localStorage.getItem('allProducts')) || []

  const productInCart = cart.find(
    (item) => item.name.toUpperCase() === productName
  )

  if (productInCart) {
    productInCart.count = count
  }
  localStorage.setItem('allProducts', JSON.stringify(cart))

  totalPrice()
}

function decrementProduct(e, minicartCount) {
  const btnDecrement = e.target
  const quantityCount = btnDecrement.parentElement.querySelector('.count')
  const productName = quantityCount
    .closest('.minicart-product-info')
    .querySelector('.minicart-title').innerText

  const cart = JSON.parse(localStorage.getItem('allProducts')) || []
  let count = Number(quantityCount.innerText)

  if (count === 1) {
    e.target.closest('.minicart-product').remove()

    const newCart = cart.filter(
      (item) => item.name.toUpperCase() !== productName
    )

    localStorage.setItem('allProducts', JSON.stringify(newCart))
  } else {
    count--
    const productInCart = cart.filter((item) => item.name === productName)
    localStorage.setItem('allProducts', JSON.stringify(cart))

    if (productInCart) {
      productInCart.count = count
    }
  }

  quantityCount.innerText = count
  totalPrice()
  updateTotalMinicart(minicartCount)
}

function productRemove(e, minicartCount) {
  e.target.closest('.minicart-product').remove()
  const productName = e.target
    .closest('.minicart-product-info')
    .querySelector('.minicart-title').innerText

  const cart = JSON.parse(localStorage.getItem('allProducts')) || []
  const newCart = cart.filter((item) => item.name !== productName)
  localStorage.setItem('allProducts', JSON.stringify(newCart))

  totalPrice()
  updateTotalMinicart(minicartCount)
}

function updateTotalMinicart(minicartCount) {
  const products = document.querySelectorAll('.minicart-product')
  minicartCount.innerText = products.length
}

// calculate total
function totalPrice() {
  const products = document.querySelectorAll('.minicart-product')
  const total = document.querySelector('.minicart-total .total')
  const subTotal = document.querySelector('.minicart-subtotal .total')
  const shipping = document.querySelector('.minicart-delivery .total').innerText

  let totalPrice = 0

  products.forEach((product) => {
    const priceText = product.querySelector('.price').innerText
    const price = parseFloat(priceText)
    const count = Number(product.querySelector('.count').innerText)
    const totalProduct = price * count
    totalPrice += totalProduct
  })

  const shippingValue = parseFloat(shipping)
  const subTotalFormatted = totalPrice.toFixed(2)
  const totalFormatted = (totalPrice + shippingValue).toFixed(2)

  subTotal.innerText = subTotalFormatted
  total.innerText = totalFormatted
}

export {
  openMinicart,
  closeMinicart,
  addToCart,
  attachQuantityListeners,
  incrementProduct,
  decrementProduct,
  productRemove,
  updateTotalMinicart,
  totalPrice,
}
