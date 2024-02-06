var searchCityEl = document.getElementById("searchCity");
var cityHeadingEl = document.querySelector(".cityNameDate");
//api key from profile
var apiKey = "&appid=b1753ec59a219420447810a8ba1a0092";
// Declares a 'list' variable that holds the parsed searched cities retrieved from 'localStorage'
// If there is nothing in 'localStorage', sets the 'list' to an empty array
var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];

//display searched city list
function displaySearchedCities() {
    for(i = 0; i < searchedCities.length; i++) {
        //for each searched city create list item
        var searchedCityListEl = document.createElement("li");
        searchedCityListEl.classList = "searchedCity";
        var searchedCityBtn = document.createElement("button");
        searchedCityBtn.classList = "btn cityBtn";
        searchedCityBtn.textContent = searchedCities[i];
        searchedCityListEl.appendChild(searchedCityBtn);
        $(".searchedCitiesList").append(searchedCityListEl);
    }
}
function getCity(city) {
    //show city and date in currentWeather div
    var date = moment().format("MM/DD/YYYY");
    city = searchCityEl.value.trim() || city;
    cityHeadingEl.textContent = city + " (" + date + ")";

    //save city to local storage
    searchedCities.push(city);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    //show cities in list


    //format weather api url to get long/lat
    var weatherApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + apiKey;

    //make a request to the url 
    fetch(weatherApiUrl).then(function(response) {
       //if no 404 error/ response.ok = successful, if not alert if there is a 404 error
       if(response.ok) {
        response.json().then(function(data) {
            getCurrentWeather(data);
        });
    } else {
        alert("Please enter a valid city.");
    }
})
    .catch(function(error) {
        //catch 
        alert("Unable to connect, please try again")
    })
}

function getCurrentWeather(city) {
    //clear input text box
    searchCityEl.value = "";
    //get latitude and longitude for city to pass into fetch request
    var latitude = city[0].lat;
    var longitude = city[0].lon;

    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + apiKey; 

    fetch(apiUrl).then(function(response) {
        //if no error 
        if(response.ok) {
            response.json().then(function(data) {
                //get main weather icon
                var weatherIconInfo = data.current.weather[0].icon;
                var weatherIconEl = document.createElement("img");
                weatherIconEl.src = "https://openweathermap.org/img/wn/" + weatherIconInfo + ".png";
                cityHeadingEl.appendChild(weatherIconEl);

                //get info for current weather div list 
                var currentTemp = data.current.temp;
                var currentWindSpeed = data.current.wind_speed;
                var currentHumidity = data.current.humidity;
                var currentUvIndex = data.current.uvi;
                //for uv element to create color coding of value
                var currentUvEl = document.createElement("span");
                currentUvEl.textContent = currentUvIndex;
                if(currentUvIndex <= 2) {
                    currentUvEl.classList = "favorable";
                } else if(currentUvIndex > 2 && currentUvIndex < 6) {
                    currentUvEl.classList = "moderate";
                } else if (currentUvIndex >= 6) {
                    currentUvEl.classList = "severe";
                }
                //show it on the current weather div
                $(".temp").text("Temp: " + currentTemp + "\u00B0 F"); 
                $(".wind").text("Wind: " + currentWindSpeed + " MPH");
                $(".humidity").text("Humidity: " + currentHumidity + " %");
                $(".uvIndex").text("UV Index: ").append(currentUvEl);

                fiveDayForecast(latitude, longitude);
                addSearchedCity();
                
            })
        } 
    })
    .catch(function(error) {
        //catch 
        alert("Unable to connect to One Call")
    });
}
//five day forecast
function fiveDayForecast(latitude, longitude){
    //clear five day forecast div to just show the heading prior to creating new elements for 5 day forecast
    $(".forecast").html("<h3 class='forecastHeading'>5-Day Forecast:</h3>");
    var forecastApiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts" + "&units=imperial" + apiKey; 
    //fetch 
    fetch(forecastApiUrl).then(function(response) {
        //if no error 
        if(response.ok) {
            response.json().then(function(data) {
                var dailyArray = data.daily;

                for(i = 1; i < 6; i++) {
                    //create div to hold each day info
                    var forecastDay = document.createElement("div");
                    forecastDay.classList = "forecastDay col";
                    $(".forecast").append(forecastDay);
                    //show date
                    var unixDate = data.daily[i].dt;
                    var dateToShow = moment.unix(unixDate).format("MM/DD/YYYY");
                    var dayDateEl = document.createElement("h4");
                    dayDateEl.classList = "dailyForecastDate";
                    dayDateEl.textContent = dateToShow;
                    forecastDay.appendChild(dayDateEl);

                    //show weather icon for  each day
                    var dailyIcon = data.daily[i].weather[0].icon;
                    var dailyIconEl = document.createElement("img");
                    dailyIconEl.src = "https://openweathermap.org/img/wn/" + dailyIcon + ".png";
                    forecastDay.appendChild(dailyIconEl);

                    //show daily temp for the day
                    var dailyTemp = document.createElement("p");
                    dailyTemp.textContent = "Temp: " + data.daily[i].temp.day + "\u00B0 F";
                    forecastDay.appendChild(dailyTemp);


                    //show daily wind speed for the day
                    var dailyWind = document.createElement("p");
                    dailyWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                    forecastDay.appendChild(dailyWind);
                    
                    // show daily humidity
                    var dailyHumidity = document.createElement("p");
                    dailyHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
                    forecastDay.appendChild(dailyHumidity);
                }
            })
        }
    })
}

function addSearchedCity() {
       //add city to searched city list with button 
       var lastSearchedCityList = document.createElement("li")
       lastSearchedCityList.classList = "searchedCity";
       var lastSearchedCityBtn = document.createElement("button");
       lastSearchedCityBtn.classList = "btn cityBtn";
       lastSearchedCityBtn.textContent = searchedCities[searchedCities.length - 1];
       lastSearchedCityList.appendChild(lastSearchedCityBtn);
       $(".searchedCitiesList").append(lastSearchedCityList);
}

//when click button to search, functions begin
$(".searchBtn").on("click", getCity);
// add city button functionality
$(document).on("click", ".cityBtn", function() {
    var btnCity = event.target.textContent
    getCity(btnCity);
})
displaySearchedCities();