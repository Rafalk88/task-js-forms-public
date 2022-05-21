const uploader = document.querySelector('.uploader__input')

uploader.addEventListener('change', readFile)

function readFile(e) {

    const file = e.target.files[0]

    if (file && file.type.includes('text/csv')) {

        const reader = new FileReader()

        reader.onload = function(readerEvent) {

            const content = readerEvent.target.result
            console.log(content.split(/[\r\n]+/gm))

        }
        reader.readAsText(file, 'UTF-8')

    } else { console.error('Sth not woring!') }
    
}