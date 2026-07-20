const data = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
    { id: 8, name: 'Honeydew' },
    { id: 9, name: 'Kiwi' },
    { id: 10, name: 'Lemon' },
];

function debounce(fn, delay) {

    let timeoutId = null
    
    return function(...args) {
        
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function searchFunction(query) {

    let resultsDropdown = document.getElementById("results-dropdown")
    if (!resultsDropdown) return

    resultsDropdown.innerHTML = ''
    resultsDropdown.classList.add("active")

    const filteredData = data.filter(item => query && item.name.toLowerCase().includes(query.toLowerCase()))

    if (filteredData.length) {
        filteredData.forEach(item => {
            appendResultsItemToDropdown(item.name)
        })
    } else {
        resultsDropdown.classList.remove("active")
    }

}

function appendResultsItemToDropdown(text) {

    let resultsDropdown = document.getElementById("results-dropdown")
    if (!resultsDropdown) return

    let div = document.createElement("div")
    div.className = "result-item"
    div.textContent = text
    resultsDropdown.appendChild(div)
}

const debouncedSearch = debounce(searchFunction, 1500)

const searchInput = document.getElementById("search-input")
if (searchInput) {
    searchInput.addEventListener("input", (e) => debouncedSearch(e.target.value))
}