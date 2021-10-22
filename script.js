'use strict';
const countriesContainer = document.querySelector('.countries');
const btnWhereAmI = document.querySelector('.btn-country');

const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

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

const whereAmI = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

let neighbors;

const getNeighbors = async function () {
  for (const neighbor of neighbors) {
    const resNeighbor = await fetch(
      `https://restcountries.com/v3.1/alpha/${neighbor}`
    );
    const [dataNeighbor] = await resNeighbor.json();
    renderCountry(dataNeighbor, 'neighbour');
  }
};

const getLocationInfo = async function () {
  try {
    // HIGHLIGHT: GeoLocation
    const position = await whereAmI();
    const { latitude, longitude } = position.coords;

    // HIGHLIGHT: Reverse Geocoding
    const resGeo = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    /* NOTE: Same as
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(res => console.log(res))
  */
    // HIGHLIGHT: Country Data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting country');
    // console.log(res);
    const [data] = await res.json();
    console.log(data);
    renderCountry(data);

    neighbors = data.borders;
    if (!neighbors) {
      renderError(`No Neighbor Country Found`);
      return;
    }
    getNeighbors();
  } catch (err) {
    console.error(err);
    renderError(`💥 ${err.message}`);

    /*HIGHLIGHT: Reject Promise returned from Async function
    - Async function do not reject Promise
    - Need to rethrow error
    */
    throw err;
  }
};

btnWhereAmI.addEventListener('click', getLocationInfo);
