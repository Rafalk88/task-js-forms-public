document.addEventListener('DOMContentLoaded', init)

function init() {

const uploader = document.querySelector('.uploader__input')
const ulEl = document.querySelector('.panel__excursions')
const liEl = document.querySelector('.excursions__item')
const summaryUlEl = document.querySelector('.panel__summary')
const summaryLiEl = document.querySelector('.summary__item')
let pricesTable = [] // dane o cenach oferty
let numberOfPeopleTable = [] // dane o liczbie osób

uploader.addEventListener('change', readFile)

function readFile(e) {

    const file = e.target.files[0]

    if (file && file.type.includes('text/csv')) {

        const reader = new FileReader()

        reader.onload = function(readerEvent) {

            const content = readerEvent.target.result
            createOffer(content)

        }
        reader.readAsText(file, 'UTF-8')

    } else { console.error('Sth not woring!') }
    
}

function createOffer(offerInfo) {

    offer = offerInfo.split(/[\r\n]+/gm)
    
    offer.forEach(function (item) {

        const newOffer = item.split('"')

        const newLi = liEl.cloneNode(true)
        newLi.classList.remove('excursions__item--prototype')

        // Dodajemy tytuł i opis do oferty
        let title = newLi.querySelector('.excursions__title')
        let description = newLi.querySelector('.excursions__description')
        title.innerText = newOffer[3]
        description.innerText = newOffer[5]

        // Dodajemy cenę oferty
        const prices = newLi.querySelectorAll('.excursions__price')
        prices[0].innerText = newOffer[7]
        prices[1].innerText = newOffer[9]
       
        ulEl.appendChild(newLi)

        const inputs = newLi.querySelectorAll('.excursions__field-input')
        inputs.forEach(getNumberOfTickets)

    })

}

function getNumberOfTickets(e) {
    
    if (e.type === 'text') {
        
        e.addEventListener('change', function(e) {
        
            e.preventDefault()
            
            if (e.target.name === 'adults') {

                const adultNumber = e.target.value
                pricesTable.push(Number(e.target.previousElementSibling.innerText))
                numberOfPeopleTable.push(Number(adultNumber))

            } else if (e.target.name === 'children') {

                const childrenNumber = e.target.value
                pricesTable.push(Number(e.target.previousElementSibling.innerText))
                numberOfPeopleTable.push(Number(childrenNumber))
                
            }

        })
        
    } else if (e.type === 'submit') {

        e.addEventListener('click', function(e) {

            e.preventDefault()
            setSummary(pricesTable, numberOfPeopleTable)

            // czyszczenie tablicy, aby były tam tylko dane z konkretnej oferty
            pricesTable = []
            numberOfPeopleTable = []

        })

    }

}

function setSummary(price, number) {

    const newSummaryLiEl = summaryLiEl.cloneNode(true)
    newSummaryLiEl.classList.remove('summary__item--prototype')
    summaryUlEl.appendChild(newSummaryLiEl)
    console.log(newSummaryLiEl)

}

}