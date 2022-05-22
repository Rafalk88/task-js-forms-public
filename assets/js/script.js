document.addEventListener('DOMContentLoaded', init)

function init() {

const uploader = document.querySelector('.uploader__input')
const ulEl = document.querySelector('.panel__excursions')
const liEl = document.querySelector('.excursions__item')
const summaryUlEl = document.querySelector('.panel__summary')
const summaryLiEl = document.querySelector('.summary__item')

let inputReset = [] // tablica z inputami. Po kliknięciu w submit inputy się resetują
let offerObj = {

    name: '',
    adultPrice: '',
    childrenPrice: '',
    numberOfAdults: '',
    numberOfChildren: '',

}

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
        
        e.addEventListener('input', function(e) {
        
            e.preventDefault()

            if (offerObj.name === '') {

                offerObj.name = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerText

            }
            
            if (e.target.name === 'adults') {

                const adultNumber = e.target.value
                inputReset.push(e.target)
                offerObj.adultPrice = Number(e.target.previousElementSibling.innerText)
                offerObj.numberOfAdults = Number(adultNumber)

            } else if (e.target.name === 'children') {

                const childrenNumber = e.target.value
                inputReset.push(e.target)
                offerObj.childrenPrice = Number(e.target.previousElementSibling.innerText)
                offerObj.numberOfChildren = Number(childrenNumber)
                
            }
           

        })
        
    } else if (e.type === 'submit') {

        e.addEventListener('click', function(e) {

            e.preventDefault()
            setSummary()

            // czyszczenie tablicy, aby były tam tylko dane z konkretnej oferty
            offerObj = {

                name: '',
                adultPrice: '',
                childrenPrice: '',
                numberOfAdults: '',
                numberOfChildren: '',
            
            }

            // czyszczenie inputów
            inputReset[0].value = ''
            inputReset[1].value = ''

        })

    }

}

function setSummary() {
    const newSummaryLiEl = summaryLiEl.cloneNode(true)
    newSummaryLiEl.classList.remove('summary__item--prototype')

    newSummaryLiEl.children[0].children[0].innerText = `${offerObj.name}:`
    const summPrice = ((offerObj.adultPrice * offerObj.numberOfAdults) + (offerObj.childrenPrice * offerObj.numberOfChildren))
    newSummaryLiEl.children[0].children[1].innerText = `${summPrice} PLN`
    newSummaryLiEl.lastElementChild.innerText = `dorośli: ${offerObj.numberOfAdults} x ${offerObj.adultPrice}PLN, dzieci: ${offerObj.numberOfChildren} x ${offerObj.childrenPrice}PLN`
    summaryUlEl.appendChild(newSummaryLiEl)

    newSummaryLiEl.children[0].children[2].addEventListener('click', removeSummaryOffer)
}

function removeSummaryOffer(e) {

    e.preventDefault()
    const li = e.target.parentElement.parentElement
    li.remove()

}

}