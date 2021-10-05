'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  /* NOTE: Register a Callback function on the request object for the Load Event
- Send off the request
- Request then fetches data in the background
= Once that is done, emit the load event
*/
  request.addEventListener('load', function () {
    // console.log(this.responseText);

    // NOTE: Destructuring -> An array of Object
    const [data] = JSON.parse(this.responseText);
    // = const data= JSON.parse(this.responseText)[0]
    console.log(data);
    // console.log(Object.keys(data.currencies));

    const html = `
  <article class="country">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(2)} million</p>
      <p class="country__row"><span>🗣️</span>${Object.values(
        data.languages
      )}</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>
  `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};
getCountryData('australia');
getCountryData('cn');
getCountryData('usa');
