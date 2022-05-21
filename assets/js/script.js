const uploader = document.querySelector('.uploader__input')
const ulEl = document.querySelector('.panel__excursions')
const liEl = document.querySelector('.excursions__item')

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

    })

}