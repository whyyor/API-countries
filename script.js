'use strict';
console.log('yup it is loading')
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//old school xml call
/*
const getCountryData = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`);
    request.send();

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        const html = `
  <article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    });
};
*/

// const getCountryDataAndNeigbour = function (country) {
//     const request = new XMLHttpRequest();
//     request.open('GET', `https://restcountries.com/v2/name/${country}`);
//     request.send();

//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(this.responseText);
//         console.log(data);
//         //render country 1
//         renderCountry(data);
//         //get neighbour country 2
//         const [neighbour] = data.borders;
//         if (!neighbour) return;
//         //ajax call to country 2
//         const request2 = new XMLHttpRequest();
//         request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
//         request2.send();
//         request2.addEventListener('load', function () {
//             const data2 = JSON.parse(this.responseText);
//             renderCountry(data2, 'neighbour');
//         });
//     });
// };

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
}

const renderCountry = function (data, className = '') {
    const html = `<article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
            </article>
            `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
}
// getCountryDataAndNeigbour('portugal');

const request = fetch('https://restcountries.com/v2/name/india');
console.log(request);

//how to consume a promise

const getCountryData = function (country, errorMsg = `Something went wrong`) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => {
            if (!response.ok)
                throw new Error(`${errorMsg} (${response.status})`);
            return response.json();
        })
        .then(data => {
            renderCountry(data[1]);
            const neighbour = data[1].borders[0];
            if (!neighbour) throw new Error('No neighbour found!');
            //country 2
            return fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
        })
        .then(response => {
            if (!response.ok)
                throw new Error(`Country not found ${response.status}`);
            return response.json();
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(err => {
            console.log(`${err} boom`)
            renderError(`Something went wrong ${err}, try again`);

        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        })
};
btn.addEventListener('click', function () {
    getCountryData('India');
})

const whereAmI = function () {
    getPostion()
        .then(pos => {
            const {
                lat = latitude, lng = longitude
            } = pos.coords;
            return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        })
        .then(res => {
            if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}`);

            return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
        })
        .then(res => {
            if (!res.ok) throw new Error(`Country not found (${res.status})`);

            return res.json();
        })
        .then(data => renderCountry(data[0]))
        .catch(err => console.error(`${err.message} 💥`));
};
// whereAmI(52.508, 13.381);



navigator.geolocation.getCurrentPosition(position => console.log(position), err => console.log(err));

const getPostion = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocationgetCurrentPosition(resolve, reject);
    });
};

getPostion().then(pos => console.log(pos));


btn.addEventListener('click', whereAmI());
