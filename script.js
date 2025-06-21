// seletores
const btn = document.querySelectorAll('.product-btn')
const minicartIcon = document.querySelector('.minicart-icon-container')
const overflow = document.querySelector('.minicart-overflow')
const minicart = document.querySelector('.minicart')
const closeBtn = document.querySelector('.close-btn')
const minicartCount = document.querySelector('.minicart-count')
const productContainer = document.querySelector('.minicart-product-container')
const btnDelivery = document.querySelector('.btn-delivery')
const minicartBottom = document.querySelector('.minicart-bottom')
const frete = document.querySelector('.minicart-delivery .total')
const allPrices = document.querySelectorAll('.product-price')
const allProducts = Array.from(document.querySelectorAll('.product-container'))
const productContent = document.querySelector('.total-products')
const select = document.querySelector('#filter')

// listeners
btn.forEach((item) => item.addEventListener('click', addToCart))
minicartIcon.addEventListener('click', openMinicart)
overflow.addEventListener('click', closeMinicart)
closeBtn.addEventListener('click', closeMinicart)
btnDelivery.addEventListener('click', openDeliveryFields)
minicart.addEventListener('click', (e) => e.stopPropagation())
select.addEventListener('click', filterSelect)

document.addEventListener('DOMContentLoaded', () => {
  renderProductsFromLocalStorage()
})

if (!localStorage.getItem('allProducts')) {
  localStorage.setItem('allProducts', JSON.stringify([]))
}

// funções do minicart
function openMinicart() {
  minicart.classList.add('open')
  overflow.classList.add('open')
  attachQuantityListeners()
}

function closeMinicart() {
  minicart.classList.remove('open')
  overflow.classList.remove('open')
}

function updateTotalMinicart() {
  const products = document.querySelectorAll('.minicart-product')
  minicartCount.innerText = products.length
}

// quantidade
function attachQuantityListeners() {
  const incrementBtn = document.querySelectorAll('.minicart-plus')
  const decrementBtn = document.querySelectorAll('.minicart-minus')
  const removeIcon = document.querySelectorAll('.product-remove')

  incrementBtn.forEach((btn) => btn.addEventListener('click', incrementProduct))
  decrementBtn.forEach((btn) => btn.addEventListener('click', decrementProduct))
  removeIcon.forEach((item) => item.addEventListener('click', productRemove))
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

function decrementProduct(e) {
  const btnDecrement = e.target

  const quantityCount = btnDecrement.parentElement.querySelector('.count')

  const productName = quantityCount
    .closest('.minicart-product-info')
    .querySelector('.minicart-title').innerText

  const cart = JSON.parse(localStorage.getItem('allProducts')) || []

  let count = Number(quantityCount.innerText)

  if (count === 1) {
    e.target.closest('.minicart-product').remove()

    const newCart = cart.filter((item) => item.name !== productName)
    localStorage.setItem('allProducts', JSON.stringify(newCart))
  } else {
    count--
    const productInCart = cart.find((item) => item.name === productName)

    if (productInCart) {
      productInCart.count = count
    }
    localStorage.setItem('allProducts', JSON.stringify(cart))
  }

  quantityCount.innerText = count
  totalPrice()
  updateTotalMinicart()
}

function productRemove(e) {
  e.target.closest('.minicart-product').remove()
  const productName = e.target
    .closest('.minicart-product-info')
    .querySelector('.minicart-title').innerText

  const cart = JSON.parse(localStorage.getItem('allProducts')) || []

  const newCart = cart.filter((item) => item.name !== productName)
  localStorage.setItem('allProducts', JSON.stringify(newCart))

  totalPrice()
  updateTotalMinicart()
}

// adicionar ao carrinho
function addToCart(e) {
  const selectProduct = e.target.parentElement
  const producImage = selectProduct.querySelector('.product-image').src
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
            src="${producImage}"
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
                alt=""
              />
            </div>
          </div>
        `

    productContainer.append(productAdd)

    // adiciona produto
    const items = {
      image: producImage,
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
  openMinicart()
  updateTotalMinicart()
}

// calcular total
function totalPrice() {
  const products = document.querySelectorAll('.minicart-product')
  const total = document.querySelector('.minicart-total .total')
  const subTotal = document.querySelector('.minicart-subtotal .total')
  const frete = document.querySelector('.minicart-delivery .total').innerText

  let totalPrice = 0

  products.forEach((product) => {
    const priceText = product
      .querySelector('.price')
      .innerText.replace(',', '.')
    const price = parseFloat(priceText)

    const count = Number(product.querySelector('.count').innerText)

    const totalProduct = price * count
    totalPrice += totalProduct
  })

  const freteFormat = parseFloat(frete.replace(',', '.'))

  const subTotalFormat = totalPrice.toFixed(2).replace('.', ',')
  const totalFormat = (totalPrice + freteFormat).toFixed(2).replace('.', ',')

  subTotal.innerText = subTotalFormat
  total.innerText = totalFormat
}

// localStorage
function renderProductsFromLocalStorage() {
  const newProduct = JSON.parse(localStorage.getItem('allProducts')) || []

  const productContainer = document.querySelector('.minicart-product-container')

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

  updateTotalMinicart()
  totalPrice()
}

// open fields
function openDeliveryFields() {
  const existMinicartInput = document.querySelector('.minicart-calcule')

  if (existMinicartInput) {
    existMinicartInput.remove()
    return
  }

  const newDeliveryFields = document.createElement('div')
  newDeliveryFields.classList.add('minicart-calcule')

  newDeliveryFields.innerHTML = `
            <span>Frete</span>
            <input class="minicart-input" name="delivery" type="text" value="">
            <button class="minicart-btn-calculate">CALCULAR</button>
          `

  minicartBottom.prepend(newDeliveryFields)

  const btnCalculete = document.querySelector('.minicart-btn-calculate')
  btnCalculete.addEventListener('click', calculeteDelivery)
}

// search cep
async function calculeteDelivery() {
  const cep = document.querySelector('.minicart-input').value.replace('-', '')
  const invalidCep = document.querySelector('.invalid-cep')
  const invalidCaracteres = document.querySelector('.invalid-caracteres')
  const sucessCep = document.querySelector('.sucess-cep')

  removeMessage(invalidCep)
  removeMessage(invalidCaracteres)
  removeMessage(sucessCep)

  if (cep.length !== 8) {
    frete.innerText = '0,00'
    renderMessage('Número de caracteres inválido', 'invalid-caracteres')
    totalPrice()
    return
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()

    if (data.erro) {
      frete.innerText = '0,00'
      renderMessage('CEP inválido', 'invalid-cep')
      totalPrice()
      return
    }

    if (data.regiao === 'Sudeste') {
      frete.innerText = '0,00'
      renderMessage('Você ganhou FRETE GRÁTIS', 'sucess-cep')
      totalPrice()
    } else {
      frete.innerText = '34,90'
      renderMessage('Frete calculado', 'sucess-cep')
      totalPrice()
    }
  } catch (error) {
    console.log('Deu erro:', error)
  }

  function renderMessage(text, className) {
    removeMessage(document.querySelector(`.${className}`))

    message = document.createElement('span')
    message.classList.add(className)
    message.innerHTML = `<span>${text}</span>`

    minicartBottom.appendChild(message)
  }

  function removeMessage(element) {
    if (element) {
      element.remove()
    }
  }
}

function filterSelect() {
  select.addEventListener('change', () => {
    const sorted = allProducts.sort((a, b) => {
      priceA = a.querySelector('.product-price').innerText.replace(',', '.')
      priceB = b.querySelector('.product-price').innerText.replace(',', '.')

      if (select.value === 'high-price') {
        return priceB - priceA
      } else if (select.value === 'low-price') {
        return priceA - priceB
      }
    })
    productContent.innerHTML = ''
    sorted.forEach((item) => productContent.appendChild(item))
  })
}
