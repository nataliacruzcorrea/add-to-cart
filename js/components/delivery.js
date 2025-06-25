// Open delivery input fields
function openDeliveryFields(minicartBottom, frete, totalPrice) {
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
  btnCalculete.addEventListener('click', () =>
    calculateDelivery(frete, totalPrice, minicartBottom)
  )
}

// Calculate shipping based on ZIP code
async function calculateDelivery(frete, totalPrice, minicartBottom) {
  const cep = document.querySelector('.minicart-input').value.replace('-', '')
  const invalidCep = document.querySelector('.invalid-zip')
  const loadingCep = document.querySelector('.loading-zip')
  const invalidCaracteres = document.querySelector('.invalid-characters')
  const sucessCep = document.querySelector('.success-zip')

  removeMessage(invalidCep)
  removeMessage(invalidCaracteres)
  removeMessage(sucessCep)
  removeMessage(loadingCep)

  if (cep.length !== 8) {
    frete.innerText = '0.00'
    renderMessage('Invalid number of characters', 'invalid-characters')
    totalPrice()
    return
  }

  try {
    renderMessage('Calculating shipping...', 'loading-zip')
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) throw new Error('ViaCEP não respondeu')
    const data = await response.json()

    if (data.erro) {
      removeMessage(loadingCep)
      frete.innerText = '0.00'
      renderMessage('Invalid ZIP code', 'invalid-zip')
      totalPrice()
      return
    }

    if (data.regiao === 'Sudeste') {
      removeMessage(loadingCep)
      frete.innerText = '0.00'
      renderMessage('You got FREE SHIPPING!', 'success-zip')
      totalPrice()
    } else {
      removeMessage(loadingCep)
      frete.innerText = '34.90'
      renderMessage('Shipping calculated', 'success-zip')
      totalPrice()
    }
  } catch (error) {
    console.log('Deu erro:', error)

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
      if (!response.ok) {
        renderMessage('Invalid ZIP code', 'invalid-zip')
        throw new Error('BrasilAPI failed')
      }

      const data = await response.json()

      const sudeste = ['SP', 'RJ', 'MG', 'ES']

      if (sudeste.includes(data.state)) {
        frete.innerText = '0.00'
        renderMessage('You got FREE SHIPPING!', 'success-zip')
        totalPrice()
      } else {
        frete.innerText = '34.90'
        renderMessage('Shipping calculated', 'success-zip')
        totalPrice()
      }
    } catch (error) {
      console.log('Fallback API error:', error)
    }
  }

  function renderMessage(text, className) {
    removeMessage(document.querySelector(`.${className}`))

    removeMessage(document.querySelector('.invalid-zip'))
    removeMessage(document.querySelector('.invalid-characters'))
    removeMessage(document.querySelector('.success-zip'))
    removeMessage(document.querySelector('.loading-zip'))

    const message = document.createElement('span')
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

export { openDeliveryFields, calculateDelivery }
