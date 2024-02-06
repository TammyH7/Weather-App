$(document).ready(function () {

  // API Key from profile
  const APIkey = "c849758209af78b1c0f70234232a316b";
  
  var weatherIconCode = "";
  var inputResponse = "";
  var history = [];

  function loadLastSearch() {
    if (localStorage.getItem("key_0") != null) {
      // for (i = 0; i < localStorage.length; i++) {

      var keyIndex = localStorage.length - 1;
      var values = localStorage.getItem("key_" + keyIndex);
      
      
      var locationInput = values.replace(/"/g, "");
      console.log(locationInput);
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        locationInput +
        "&appid=" +
        APIkey;

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        inputResponse = response;
        weatherIconCode = response.weather[0].icon;
        var weatherURL =
          "http://openweathermap.org/img/w/" + weatherIconCode + ".png";

        var currentDate = moment().format("L");
        //grab Kelvin and convert to F
        var kelvin = response.main.temp;
        var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        //humidity
        var humidity = response.main.humidity;
        //wind speed
        var windSpeed = response.wind.speed;

        $(".current-location").text(`${response.name} ${currentDate}`);
        $("#weatherDisplay").attr("src", weatherURL);
        $("#weatherDisplay").attr("alt", "weather icon");
        $(".current-temp").text("Temp: " + temp + " F");
        $(".current-humidity").text("Humidity: " + humidity + "%");
        $(".wind-speed").text("Wind Speed: " + windSpeed + " mph");

        getUVIndex();

        getFiveDayForecast();
      });
      
    }
  }

  loadLastSearch();

  //Gets UV Index - called by city submission ajax req.
  function getUVIndex() {
    var lat = inputResponse.coord.lat;
    var lon = inputResponse.coord.lon;
    var urlUVIndex =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIkey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: urlUVIndex,
      method: "GET",
    }).then(function (r) {
      //Hey! this is the UV Index :D
      var uvIndex = r.value;
      $(".current-uv-index").text("UV Index: " + uvIndex);
      if (uvIndex >= 8) {
        $(".current-uv-index").attr("class", "current-uv-index very-high-uv");
      } else if (uvIndex < 8 && uvIndex >= 6) {
        $(".current-uv-index").attr("class", "current-uv-index high-uv");
      } else if (uvIndex < 6 && uvIndex >= 3) {
        $(".current-uv-index").attr("class", "current-uv-index mod-uv");
      } else {
        $(".current-uv-index").attr("class", "current-uv-index low-uv");
      }
    });
  }

  //Gets Five day forecast
  function getFiveDayForecast() {
    var city = inputResponse.name;
    var forecastURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIkey;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (r) {
      var forecastList = r.list;

      //loop through forecast days, grab time index time @ 12p for each day, and print info to forecast cards in html
      for (i = 4; i < forecastList.length; i += 8) {
        var forecastIcon = forecastList[i].weather[0].icon;
        var weatherURL =
          "http://openweathermap.org/img/w/" + forecastIcon + ".png";
        $("#weatherDisplay").attr("src", weatherURL);
        var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        var forecastDate = forecastList[i].dt_txt;
        var kelvin = forecastList[i].main.temp;
        var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
        var forecastDateFormat = moment(forecastDate).format("L");
        var humidity = forecastList[i].main.humidity;

        if (i == 4) {
          $(".forecast1-date").text(forecastDateFormat);
          $(".forecast1-img").attr("src", weatherURL);
          $(".forecast1-img").attr("alt", "weather icon");
          $(".forecast1-temp").text("Temp: " + temp + " F");
          $(".forecast1-humidity").text("Humidity: " + humidity);
        } else if (i == 12) {
          $(".forecast2-date").text(forecastDateFormat);
          $(".forecast2-img").attr("src", weatherURL);
          $(".forecast2-img").attr("alt", "weather icon");
          $(".forecast2-temp").text("Temp: " + temp + " F");
          $(".forecast2-humidity").text("Humidity: " + humidity);
        } else if (i == 20) {
          $(".forecast3-date").text(forecastDateFormat);
          $(".forecast3-img").attr("src", weatherURL);
          $(".forecast3-img").attr("alt", "weather icon");
          $(".forecast3-temp").text("Temp: " + temp + " F");
          $(".forecast3-humidity").text("Humidity: " + humidity);
        } else if (i == 28) {
          $(".forecast4-date").text(forecastDateFormat);
          $(".forecast4-img").attr("src", weatherURL);
          $(".forecast4-img").attr("alt", "weather icon");
          $(".forecast4-temp").text("Temp: " + temp + " F");
          $(".forecast4-humidity").text("Humidity: " + humidity);
        } else if (i == 36) {
          $(".forecast5-date").text(forecastDateFormat);
          $(".forecast5-img").attr("src", weatherURL);
          $(".forecast5-temp").text("Temp: " + temp + " F");
          $(".forecast5-humidity").text("Humidity: " + humidity);
        }
      }
    });
  }

  //Adds historical searches as list items on page and stores them to localStorage

  function appendHistory() {
    var listGroup = $(".list-group");
  
    var keys = Object.keys(localStorage);

    console.log("storing key index of " + keys.length);
    console.log(history);
    localStorage.setItem(
      "key_" + keys.length,
      JSON.stringify(history[history.length - 1])
    );

    listGroup.prepend(
      `<li class='list-group-item list-group-item-action historical-search'> ${
        history[history.length - 1]
      } </li>`
    );
  
  }

  function loadStorage() {
    var listGroup = $(".list-group");

    if (localStorage.getItem("key_0") != null) {
      for (i = 0; i < localStorage.length; i++) {
        var storedSearches = localStorage.getItem("key_" + i);
        //history.push(storedSearches)
        storedSearches = storedSearches.replace(/"/g, "");

        listGroup.prepend(
          `<li class='list-group-item list-group-item-action historical-search'> ${storedSearches} </li> `
        );
      }
    }
  }

  loadStorage();

  //this happens first
  $("#locationForm").on("submit", function (e) {
    e.preventDefault();
    var locationInput = $("#locationInput").val();
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationInput +
      "&appid=" +
      APIkey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      inputResponse = response;
      weatherIconCode = response.weather[0].icon;
      var weatherURL =
        "https://openweathermap.org/img/w/" + weatherIconCode + ".png";

      var currentDate = moment().format("L");
      //grab Kelvin and convert to F
      var kelvin = response.main.temp;
      var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
      //humidity
      var humidity = response.main.humidity;
      //wind speed
      var windSpeed = response.wind.speed;

      $(".current-location").text(`${response.name} ${currentDate}`);
      $("#weatherDisplay").attr("src", weatherURL);
      $("#weatherDisplay").attr("alt", "weather icon");
      $(".current-temp").text("Temp: " + temp + " F");
      $(".current-humidity").text("Humidity: " + humidity + "%");
      $(".wind-speed").text("Wind Speed: " + windSpeed + " mph");

      history.push(response.name);

      getUVIndex();

      getFiveDayForecast();

      appendHistory();

      $("#locationInput").val("");
    });
  });

  $(document).on("click", ".historical-search", function () {
    var locationInput = $(this).text();

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationInput +
      "&appid=" +
      APIkey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      inputResponse = response;
      weatherIconCode = response.weather[0].icon;
      var weatherURL =
        "http://openweathermap.org/img/w/" + weatherIconCode + ".png";

      var currentDate = moment().format("L");
      //grab Kelvin and convert to F
      var kelvin = response.main.temp;
      var temp = ((kelvin - 273.15) * 1.8 + 32).toFixed(2);
      //humidity
      var humidity = response.main.humidity;
      //wind speed
      var windSpeed = response.wind.speed;

      $(".current-location").text(`${response.name} ${currentDate}`);
      $("#weatherDisplay").attr("src", weatherURL);
      $("#weatherDisplay").attr("alt", "weather icon");
      $(".current-temp").text("Temp: " + temp + " F");
      $(".current-humidity").text("Humidity: " + humidity + "%");
      $(".wind-speed").text("Wind Speed: " + windSpeed + " mph");

      getUVIndex();

      getFiveDayForecast();
    });
  });

  $("#clear-history").on("click", function (e) {
    localStorage.clear();
    $(".list-group").empty();
  });
});
