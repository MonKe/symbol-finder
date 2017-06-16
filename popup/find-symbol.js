// lib
let searchField, searchText, symbolField, resultList, resultItem, symbolData

const
  // IO
  init = data => {
    symbolData = data
    searchField.addEventListener('keyup', handleField(searchField))
    searchField.focus()
    handleField(searchField)()
  },
  handleField = field => () => {
    if (searchText && searchText === field.value) return
    resultList.innerHTML = ''
    if (! field.value) return
    searchText = field.value
    findTerms(searchText.split(' ')).forEach(addResult)
  },
  addResult = symbol => {
    resultList.appendChild(showSymbol(symbol))
  },
  showSymbol = symbol => {
    let
      li = resultItem.cloneNode(true),
      a = li.querySelector('a')
    a.innerHTML = a.innerHTML
      .replace('$names', showNames(symbol))
      .replace('$char', showChar(symbol))
    a.addEventListener('click', selectSymbol)
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
resultItem = resultList.querySelector('li').cloneNode(true)
resultList.innerHTML = ''

fetch('ucd-packed.json')
  .then(res => res.json())
  .then(res => init(res.data))
