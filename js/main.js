import {
  openMinicart,
  closeMinicart,
  addToCart,
  updateTotalMinicart,
  totalPrice,
} from './components/minicart.js'

import { openDeliveryFields } from './components/delivery.js'
import { renderProductsFromLocalStorage } from './components/storage.js'
import { filterSelect } from './components/filters.js'

// DOM elements
const addToCartButtons = document.querySelectorAll('.product-btn')
const minicartIcon = document.querySelector('.minicart-icon-container')
const overlay = document.querySelector('.minicart-overflow')
const minicart = document.querySelector('.minicart')
const closeButton = document.querySelector('.close-btn')
const minicartCount = document.querySelector('.minicart-count')
const productList = document.querySelector('.minicart-product-container')
const deliveryButton = document.querySelector('.btn-delivery')
const minicartBottom = document.querySelector('.minicart-bottom')
const shipping = document.querySelector('.minicart-delivery .total')
const allProducts = Array.from(document.querySelectorAll('.product-container'))
const productGrid = document.querySelector('.total-products')
const selectFilter = document.querySelector('#filter')

// Event listeners
addToCartButtons.forEach((button) =>
  button.addEventListener('click', (e) =>
    addToCart(
      e,
      minicart,
      overlay,
      minicartCount,
      productList,
      totalPrice,
      updateTotalMinicart
    )
  )
)

minicartIcon.addEventListener('click', () =>
  openMinicart(minicart, overlay, minicartCount)
)

overlay.addEventListener('click', () => closeMinicart(minicart, overlay))
closeButton.addEventListener('click', () => closeMinicart(minicart, overlay))

deliveryButton.addEventListener('click', () =>
  openDeliveryFields(minicartBottom, shipping, totalPrice)
)

minicart.addEventListener('click', (e) => e.stopPropagation())

filterSelect(selectFilter, allProducts, productGrid)

// On page load
document.addEventListener('DOMContentLoaded', () => {
  renderProductsFromLocalStorage(
    productList,
    minicartCount,
    updateTotalMinicart,
    totalPrice
  )
  updateTotalMinicart(minicartCount)
  totalPrice()
})

// Initialize cart if not set
if (!localStorage.getItem('allProducts')) {
  localStorage.setItem('allProducts', JSON.stringify([]))
}
