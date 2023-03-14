
// Define a baseURL and key to as part of the request URL

const baseURL = 'http://api.openweathermap.org/data/2.5/weather';
const nextURL = 'https://api.openweathermap.org/data/3.0/onecall'
const key = 'c0e0bc244d6e2e1a2584fe5f12098d0b';


// Grab references to all the DOM elements we need to maniuplate
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const section = document.querySelector('section');

// Variables for weather data
var weatherDiv = document.getElementById("results");
var weatherData;
var lat;
var lon;
var city;
var temp;
var conditionData;
var humidityData;
var windData;

//let savedSearchArray;
//const saveButtonElements = document.querySelectorAll('.search');
// console.log(searchButtonElements);

// upon page load, let's get saved events from the local storage, i.e. localstorage.getItem()
//function getSavedSearch () {
  //  let savedSearchArray = document.querySelectorAll('.results')
    //for (let i = 0; i<savedEventsArray.length; i++) {
      //  let key = i 
        //let previousSearch = JSON.parse(localStorage.getItem(key))
        //console.log(previousSearch)
   // }
    
//function savetheSearch(results,index) {
//console.log('you clicked the save button');
//console.log(e.target);
//let key = index
//let value = JSON.stringify(results);
   
// document.querySelectorAll("textarea")[i].value
//window.localStorage.setItem(key, value);     
//console.log(key, value);
//}

// get the saved events from local storage, if any exist...
//getSavedSearch();
    
//saveButtonElements.forEach(btn => btn.addEventListener('click',(e)=>{
//e.preventDefault()
//let index = e.target.attributes[2].value;
//let results = document.querySelectorAll('.results')[index].value;
//savetheSearch(results, index)
//}))

// Event listeners to control functionality
searchForm.addEventListener('submit', submitSearch);

function submitSearch(e) {
    pageNumber = 0;
    fetchResults(e);
}
  
async function fetchResults(e) {
    // Use preventDefault() to stop the form submitting
    e.preventDefault();
    
    // Assemble the full URL
    let url = `${baseURL}?q=${searchTerm.value}&appid=${key}&units=imperial`;


    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
        // fetch weather data from api
        weatherData = data.name;
        temp = data.main.temp;
        conditionData = data.weather[0].description;
        humidityData = data.main.humidity;
        windData = data.wind.speed;
        displayWeatherResults();
        lat = data.coord.lat.toFixed(2);
        lon = data.coord.lon.toFixed(2);
        
        // user lat & lon to get 5 day forecast
        let newUrl = `${nextURL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${key}`;

        fetch(newUrl)
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            for (i = 0; i <= 5; i++) {
                // fetch max temp, min temp, and wind speed for 5 days
                var fiveDayMax = response.daily[i].temp.max;
                var fiveDayMin = response.daily[i].temp.min;
                var windSpeed = response.daily[i].wind_speed;
                var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                var d = new Date();
                let day = weekday[d.getDay()];
            
               
                // append new div to existing weather div and make p element that holds information
                var maxTemp = document.createElement("p");
                maxTemp.setAttribute(
                    "class",
                    "col mx-3 my-3 border border-dark rounded"
                  );
                maxTemp.innerHTML =
                  "<strong>" +
                  day +
                  "</strong>" +
                  "<br>" +
                  "<strong> High: </strong>" +
                  fiveDayMax +
                  "\u00B0F" +
                  "<br>" +
                  "<strong> Low: </strong>" +
                  fiveDayMin +
                  "\u00B0F" +
                  "<br>" +
                  "<strong> Wind Speed: </strong>" +
                  windSpeed;
                  weatherDiv.append(maxTemp);
            }
        });
    })
    .catch((err) => console.error(err));
    
}    

function displayWeatherResults() {
    var currentDiv = document.createElement("div");
    currentDiv.setAttribute("class", "col mx-3 my-3")
    var locationEl = document.createElement("h1");
    var tempEl = document.createElement("p");
    locationEl.innerHTML = weatherData;
    tempEl.innerHTML =
      "<strong> Temperature: </strong>" +
      temp +
      "\u00B0F" +
      "<br/>" +
      "<strong> Condition: </strong>" +
      conditionData +
      "<br/>" +
      "<strong> Humidity: </strong>" +
      humidityData +
      "<br/>" +
      "<strong> Wind: </strong>" +
      windData;
    currentDiv.append(locationEl);
    currentDiv.append(tempEl);
    weatherDiv.append(currentDiv);
}    
 

