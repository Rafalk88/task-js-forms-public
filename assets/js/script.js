document.addEventListener('DOMContentLoaded', init)

function init() {
  // constants
  const SUMM_PRICE = " PLN";
  const FILE_READER_ERROR_MESSAGE = "Sth not woring!";
  const NO_ORDER_VALUE_MESSAGE = "Your order is 0!. Please order something.";

  // selektory
  const uploader = document.querySelector(".uploader__input"); // button 'wybierz plik'
  const ulEl = document.querySelector(".panel__excursions"); // ul z elementu oferty
  const liEl = document.querySelector(".excursions__item"); // li elementu ul elementu oferty
  const summaryUlEl = document.querySelector(".panel__summary"); // ul panelu zamówienie
  const summaryLiEl = document.querySelector(".summary__item"); // li z ul panelu zamówienie
  const panelOrder = document.querySelector(".panel__order"); // element zamawiam

  // zmienne
  let inputReset = []; // tablica z inputami. Po kliknięciu w submit inputy się resetują
  let offerObj = {
    // obiekt do przenoszenia wartości oferty

    name: "",
    adultPrice: "",
    childrenPrice: "",
    numberOfAdults: "",
    numberOfChildren: "",
  };
  let summPrice; // zmienna do obliczenia sumy oferty
  let orderPrice = (panelOrder.querySelector("span").innerText = 0); // domyśla wartość całości zamówienia
  const orderBtn = panelOrder.querySelector('input[type="submit"]'); // button zamawiam wycieczkę
  const errors = []; // tablica z błędami w formularzy order

  prepareOrderPrice();
  uploader.addEventListener("change", readFile);
  orderBtn.addEventListener("click", order);

  function prepareOrderPrice() {
    // przygotowuje cenę 'razem:' do dodania poszczególnych ofert

    const spanEl = document.createElement("span");
    spanEl.innerText = SUMM_PRICE;
    panelOrder.querySelector("span").appendChild(spanEl);
  }

  function readFile(e) {
    const file = e.target.files[0];

    if (file && file.type.includes("text/csv")) {
      const reader = new FileReader();

      reader.onload = function (readerEvent) {
        const content = readerEvent.target.result;
        createOffer(content);
      };
      reader.readAsText(file, "UTF-8");
    } else {
      alert(FILE_READER_ERROR_MESSAGE);
    }
  }

  function createOffer(offerInfo) {
    offer = offerInfo.split(/[\r\n]+/gm);

    offer.forEach(function (item) {
      const newOffer = item.split('"');

      const newLi = liEl.cloneNode(true);
      newLi.classList.remove("excursions__item--prototype");

      // Dodajemy tytuł i opis do oferty
      let title = newLi.querySelector(".excursions__title");
      let description = newLi.querySelector(".excursions__description");
      title.innerText = newOffer[3];
      description.innerText = newOffer[5];

      // Dodajemy cenę oferty
      const prices = newLi.querySelectorAll(".excursions__price");
      prices[0].innerText = newOffer[7];
      prices[1].innerText = newOffer[9];

      ulEl.appendChild(newLi);

      const inputs = newLi.querySelectorAll(".excursions__field-input");
      inputs.forEach(getNumberOfTickets);
    });
  }

  function getNumberOfTickets(e) {
    if (e.type === "text") {
      e.addEventListener("input", function (e) {
        e.preventDefault();

        if (offerObj.name === "") {
          offerObj.name =
            e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].innerText;
        }

        if (e.target.name === "adults") {
          const adultNumber = e.target.value;
          inputReset.push(e.target);
          offerObj.adultPrice = Number(
            e.target.previousElementSibling.innerText
          );
          offerObj.numberOfAdults = Number(adultNumber);
        } else if (e.target.name === "children") {
          const childrenNumber = e.target.value;
          inputReset.push(e.target);
          offerObj.childrenPrice = Number(
            e.target.previousElementSibling.innerText
          );
          offerObj.numberOfChildren = Number(childrenNumber);
        }
      });
    } else if (e.type === "submit") {
      e.addEventListener("click", function (e) {
        e.preventDefault();
        setSummary();

        // czyszczenie tablicy, aby były tam tylko dane z konkretnej oferty
        offerObj = {
          name: "",
          adultPrice: "",
          childrenPrice: "",
          numberOfAdults: "",
          numberOfChildren: "",
        };

        // czyszczenie inputów
        inputReset[0].value = "";
        inputReset[1].value = "";
      });
    }
  }

  function setSummary() {
    const newSummaryLiEl = summaryLiEl.cloneNode(true);
    newSummaryLiEl.classList.remove("summary__item--prototype");

    newSummaryLiEl.querySelector(
      ".summary__name"
    ).innerText = `${offerObj.name}:`;
    summPrice =
      offerObj.adultPrice * offerObj.numberOfAdults +
      offerObj.childrenPrice * offerObj.numberOfChildren;
    newSummaryLiEl.querySelector(
      ".summary__total-price"
    ).innerText = `${summPrice} PLN`;
    newSummaryLiEl.lastElementChild.innerText = `dorośli: ${offerObj.numberOfAdults} x ${offerObj.adultPrice} PLN, dzieci: ${offerObj.numberOfChildren} x ${offerObj.childrenPrice} PLN`;
    summaryUlEl.appendChild(newSummaryLiEl);

    newSummaryLiEl
      .querySelector(".summary__btn-remove")
      .addEventListener("click", removeSummaryOffer);

    //dodaje sumę wycieczki do sumy końcowej
    orderPrice += summPrice;
    panelOrder.querySelector("span").innerText = orderPrice;
    prepareOrderPrice();
  }

  function removeSummaryOffer(e) {
    e.preventDefault();
    const li = e.target.parentElement.parentElement.parentElement;

    const re = /[0-9]+/gm;
    const price = li.querySelector(".summary__total-price").innerText;
    const priceToRemove = price.match(re);
    li.remove();

    //odejmuje sumę wycieczki od sumy końcowej
    orderPrice -= Number(priceToRemove[0]);
    panelOrder.querySelector("span").innerText = orderPrice;
    prepareOrderPrice();
  }

  function order(e) {
    e.preventDefault();
    //wyczyść błędy
    const ulErrEl = panelOrder.querySelector(".order__field-error_list");
    if (ulErrEl) {
      errors.length = 0;
      ulErrEl.remove();
    }

    validateForm();

    // tworzymy ul dla wyświetlenia błędów formularza
    const errorsUlEl = document.createElement("ul");
    errorsUlEl.classList.add("order__field-error_list");
    panelOrder
      .querySelector(".order__field:nth-child(3)")
      .appendChild(errorsUlEl);
    errorsUlEl.innerText = "";

    if (errors.length === 0) {
      if (orderPrice !== 0) {
        alert(
          `Dziękujemy za złożenie zamówienia o wartości ${orderPrice} PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: ${panelOrder[1].value}.`
        );
      } else {
        alert(NO_ORDER_VALUE_MESSAGE);
      }
    } else {
      errors.forEach(function (text) {
        const errorLiEl = document.createElement("li");
        errorLiEl.innerText = text;
        errorLiEl.classList.add("order__field-error_item");
        errorsUlEl.appendChild(errorLiEl);
      });
    }
  }

  function handleInputErrors(inputName, operator) {
    const input = panelOrder.querySelector(`input[name='${inputName}']`);

    if (operator === "add") {
      input.classList.add("input__error");
    }
    if (operator === "remove") {
      input.classList.remove("input__error");
    }
  }

  function validateForm() {
    fields = [
      { name: "name", label: "Imię i nazwisko:" },
      {
        name: "email",
        label: "Email",
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      },
    ];

    fields.forEach(function (object) {
      const value = panelOrder.elements[object.name].value;

      if (value.length === 0) {
        errors.push(`Dane w polu ${object.label} są niepoprawne!`);
        handleInputErrors(object.name, "add");
      } else {
        handleInputErrors(object.name, "remove");
      }

      if (object.pattern) {
        const reg = new RegExp(object.pattern);

        if (!reg.test(value)) {
          errors.push(
            `Dane w polu ${object.label} muszą być zgodne ze wzorem: account_name@server_address`
          );
          handleInputErrors(object.name, "add");
        } else {
          handleInputErrors(object.name, "remove");
        }
      }
    });
  }
}