/* Global Variables */
const geoURL = "http://api.geonames.org/searchJSON?";
let geoHits = "&maxRows=1";
const geoKey = "7d25b97d22b8555d82fc4dee54fce27e";
console.log(`Your GEO API key is ${geoKey}`);

const weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherKey = "b4dd23218f344ba38800c619002e1488";
console.log(`Your WEATHER API key is ${weatherKey}`);

const pixabayURL = "https://pixabay.com/api/?key=";
let pixabayImage = "&image_type=photo";
const pixKey = "22985934-c58a8d923a3cec54630fbced1";
console.log(`Your PIX API key is ${pixKey}`);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

async function generatePage(e) {
    e.preventDefault()

    /*Assign variables from UI*/
    let location = document.getElementById("where").value
    let locArray = location.split("/");

    let city = locArray[0];
    let country = locArray[1];

    /*Date Variables*/
    let departDate = new Date(document.getElementById("when").value);
    let today = newDate;

    let countdown = calcDays(departDate, today);

    let formData = {
        city: city,
        country: country,
        countdown: countdown,
        latitude,
        longitude,
        maxTemp,
        minTemp,
        description,
        image
    };

    //http://api.geonames.org/searchJSON?q=london&maxRows=10&username=demo
    getGeo(`${geoURL}q=${city}${geoHits}&username=ivilledprincipe`)
        .then(function (geoResult) {
            formData[3] = geoResult[0]
            formData[4] = geoResult[1]
            console.log("getGeo: " + formData)
        });
    
    //https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
    getFore(`${weatherURL}lat=${formData[3]}&lon=${formData[4]}&key=${weatherKey}`)
        .then(function (foreResult) {
            formData[5] = foreResult[0]
            formData[5] = foreResult[1]
            formData[7] = foreResult[2]
            console.log("getFore: " + formData)
        });

    //"https://pixabay.com/api/?key=" + pixaKey + "&q=" + city + "&image_type=photo"
    getPic(`${pixabayURL}${pixKey}&q=${city}${pixabayImage}`)
        .then(function (imageUrl) {
          formData[8] = imageUrl
          console.log("getPic: " + formData)
        });

    postData("http://localhost:8080/callAPI", formData)
        .then(function (result) {
            updateUI(result);
        });
}

async function newPage(e) {
    e.preventDefault()
    location.reload();
}

function calcDays(end, start) {
    let days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return days;
}

const getGeo = async (geoNamesURL) => {
    const response = await fetch(geoNamesURL);
    try {
        let geoData = await response.json();
        const lat = geoData.geonames[0].lat;
        const lng = geoData.geonames[0].lng;
        const geoResult = [lat, lng];
        console.log('geoResult:' + geoResult)
        return geoResult;
    } catch (error) {
        console.log(' Error:', error);
    }
}

const getFore = async (weatherBitURL) => {
    const response = await fetch(weatherBitURL);
    try {
        let foredata = await response.json();
        const max = foredata.data[0].max_temp;
        console.log('max temp:' + max);
        const min = foredata.data[0].low_temp;
        console.log('min temp:' + min);
        const desc = foredata.data[0].weather.description;
        console.log('desc:' + desc);
        const foreResult = [max, min, desc];
        return foreResult;
    } catch (error) {
        console.log(' Error:', error);
    }
}

const getPic = async (pixBayURL) => {
    const response = await fetch(pixBayURL);
    try {
        let pixData = await response.json();
        const imgUrl = pixData.hits[0].pageURL;
        console.log('imgUrl:' + imgUrl)
        return imgUrl;
    } catch (error) {
        console.log(' Error:', error);
    }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const updateUI = async () => {
    const request = await fetch('/all');
    console.log('update');

    try {
        //Fill elements with weather data to be displayed
        const allData = await request.json();
        document.getElementById('where').innerHTML = allData.city;
        document.getElementById('when').innerHTML = allData.date;

        let image = document.getElementById("img");
        image.setAttribute('src', imageURL);
        image.setAttribute('width', 500);
        image.setAttribute('height', 500);

        document.getElementById('countdown').innerHTML = allData.countdown;
        document.getElementById('weather').innerHTML = "Typical Weather";
        document.getElementById('temperature').innerHTML = "High: " + allData.max + " Low: " + allData.min;
        document.getElementById('description').innerHTML = allData.description;

    } catch (error) {
        console.log("error", error);
    }
}

export { generatePage, newPage }