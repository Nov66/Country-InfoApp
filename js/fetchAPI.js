'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
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
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

// HIGHLIGHT: Helper function to get JSON
const getJSON = function (url, errorMessage = 'Something went wrong') {
  // NOTE: Return fetch = return Promise -> we need our function itself to return a promise
  return fetch(url).then(response => {
    // HIGHLIGHT: Create our own Error Message to handle 404
    if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`);
    }
    return response.json();
  });
};

const getCountryData = country => {
  // NOTE: Country 1
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(([data]) => {
      renderCountry(data);
      const neighbors = data.borders;
      if (!neighbors) throw new Error('No Neighbor found!');
      return neighbors;
    })
    .then(neighbors => {
      neighbors.forEach(neighbor => {
        getJSON(
          `https://restcountries.com/v3.1/alpha/${neighbor}`,
          'Country not found'
        ).then(([data]) => renderCountry(data, 'neighbour'));
      });
    })
    .catch(err => {
      console.log(`${err}`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
btn.addEventListener('click', function () {
  getCountryData('australia');
});
