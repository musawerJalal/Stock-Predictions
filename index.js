import { dates } from ' /utils/dates'

const tickersArray = []
const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const tickerInput = document.getElementById("ticker-input")
        if (tickerInput.value.length > 2) {
            generateReportBtn.disabled = false
            const newTicker = tickerInput.value
            tickersArray.push(newTicker.toUpperCase())
            tickerInput.value = ''
            renderTickets()
        } else {
            const label = document.getElementsByTagName('label')[0]
            label.style.color = 'red'
            label.textContent = 'You must add at least one ticker. A ticker is a 3 or more letter code for a stock'
        }
})

function renderTickets(){
    const tickerDiv = document.querySelector('.ticker-choice-display')
    tickerDiv.innerHTML = ''
    tickersArray.forEach(ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickerDiv.appendChild(newTickerSpan)
    }
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

async function fetchStockData(){
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArray.map(async (ticker) => {
            const url = 'https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/$'
            {dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}
            const response = await fetch(url)
            const data = await  response.text()
            const status = await response.status
            if (status === 200) {
                apiMessage.innerText = 'Creating Report...'
                return data
            }
            else{
                loadingArea.innerText = 'There was an error fetching stock data'
            }
        }))
        fetchReport(stockData.join(''))
    }
    catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data'
        console.error('error: ', err)
    }
}

