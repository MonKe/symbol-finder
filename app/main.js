// lib
let searchField, searchText, symbolField, resultList, symbolData

const
  // IO
  init = data => {
    symbolData = data
    searchField.addEventListener('keyup', handleField(searchField))
    handleField(searchField)()
  },
  handleField = field => () => {
    if (! field.value) return resultList.innerHTML = ''
    if (searchText && searchText === field.value) return
    searchText = field.value
    findTerms(searchText.split(' ')).forEach(addResult)
  },
  addResult = symbol => {
    resultList.appendChild(showSymbol(symbol))
  },
  showSymbol = symbol => {
    let
      li = document.createElement('li'),
      a = document.createElement('a'),
      code = document.createElement('code')
    code.setAttribute('title', showNames(symbol))
    code.innerText = showChar(symbol)
    a.appendChild(code)
    a.setAttribute('href', '#')
    a.addEventListener('click', selectSymbol)
    li.appendChild(a)
    return li
  },
  selectSymbol = e => {
    symbolField.value = e.target.textContent.trim()
    symbolField.select()
    try {
      document.execCommand('copy')
    }
    catch (error) {
      console.log(error)
    }
    e.preventDefault()
  },
  // Pure
  findTerms = termList =>
    termList.reduce((list, term) =>
      list.filter(hasName(term)),
      symbolData
    ),
  hasName = term => symbol =>
    symbol.na.some(name => name.includes(term.toUpperCase())),
  showChar = symbol => String.fromCodePoint(parseInt(symbol.cp, 16)),
  showNames = symbol => symbol.na.join(', ').toLowerCase()

// init
searchField = document.getElementById('search-field')
symbolField = document.getElementById('symbol-field')
resultList = document.getElementById('result-list')

fetch('app/ucd-packed.json')
  .then(res => res.json())
  .then(res => init(res.data))
