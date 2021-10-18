'use strict';
const countriesContainer = document.querySelector('.countries');
const btnWhereAmI = document.querySelector('.btn-country');

const renderCountry = (data, className = '') => {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.svg}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} million</p>
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

const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const whereAmI = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getLocationInfo = () => {
  whereAmI()
    .then(position => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(position);
      return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Problem with GeoCoding ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const country = data.country;
      return country;
    })
    .then(country => {
      return fetch(`https://restcountries.com/v3.1/name/${country}`);
    })
    .then(response => response.json())
    .then(([data]) => {
      console.log(data);
      renderCountry(data);

      const neighbors = data.borders;
      return neighbors;
    })
    .then(neighbors => {
      if (!neighbors) {
        renderError(`No Neighbor Country Found`);
        return;
      }
      neighbors.forEach(neighbor => {
        fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`)
          .then(response => response.json())
          .then(([data]) => renderCountry(data, 'neighbour'));
      });
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went WRONG 💥💥. Please Try Again`);
    });
};

btnWhereAmI.addEventListener('click', getLocationInfo);
