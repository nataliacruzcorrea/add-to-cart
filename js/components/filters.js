function filterSelect(select, allProducts, productContent) {
  select.addEventListener('change', () => {
    const sorted = allProducts.sort((a, b) => {
      const priceA = a.querySelector('.product-price').innerText
      const priceB = b.querySelector('.product-price').innerText

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

export { filterSelect }
