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
            console.log(content.split(/[\r\n]+/gm))
            createOffer(content)

        }
        reader.readAsText(file, 'UTF-8')

    } else { console.error('Sth not woring!') }
    
}

function createOffer(offerInfo) {

    offer = offerInfo.split(/[\r\n]+/gm)
    offer.forEach(function () {

        const newLi = liEl.cloneNode(true)
        newLi.classList.remove('excursions__item--prototype')
        ulEl.appendChild(newLi)

    })

}