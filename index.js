// Nothing

let DAYS = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

function getCurrentDate() {
  let date = new Date();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let day = DAYS[date.getDay()];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let current_date = date.getDate();
  return `${day}, ${current_date} ${month} ${year}.`;
}

async function fetchWeatherAPI(url) {
  let response = await fetch(url);
  localStorage.clear();

  if (response.status == 200) {
    let data = await response.json();
    let output = "";
    output += `
                <div class='weather-info'>
                    <div>
                        <h1>${data.timezone}</h1>
                        <p>${getCurrentDate()}</p>
                    </div>
                    <div class='weather-temp'>
                        <h1>${Math.round(data.current.temp)}&#176;</h1>
                        <img src='http://openweathermap.org/img/wn/${
                          data.current.weather[0].icon
                        }@2x.png' width='50' height='50' />
                    </div>
                    <div>${data.current.weather[0].description}</div>
                    <div class='weather-info-tomorrow'>
                        <table>
                            <tr>
                                <td>${
                                  DAYS[
                                    new Date(data.daily[1].dt * 1000).getDay()
                                  ]
                                }</td>
                                <td>
                                    <img src='http://openweathermap.org/img/wn/${
                                      data.daily[1].weather[0].icon
                                    }@2x.png' width='50' height='50' />
                                </td>
                                <td>${Math.round(
                                  data.daily[1].temp.min
                                )}/${Math.round(
      data.daily[1].temp.max
    )}&#176;</td>
                            </tr>
                            <tr>
                                <td>${
                                  DAYS[
                                    new Date(data.daily[2].dt * 1000).getDay()
                                  ]
                                }</td>
                                <td>
                                    <img src='http://openweathermap.org/img/wn/${
                                      data.daily[2].weather[0].icon
                                    }@2x.png' width='50' height='50' />
                                </td> 
                                <td>${Math.round(
                                  data.daily[2].temp.min
                                )}/${Math.round(
      data.daily[2].temp.max
    )}&#176;</td>
                            </tr>
                            <tr>
                                <td>${
                                  DAYS[
                                    new Date(data.daily[3].dt * 1000).getDay()
                                  ]
                                }</td>
                                <td>
                                    <img src='http://openweathermap.org/img/wn/${
                                      data.daily[3].weather[0].icon
                                    }@2x.png' width='50' height='50' />
                                </td> 
                                <td>${Math.round(
                                  data.daily[3].temp.min
                                )}/${Math.round(
      data.daily[3].temp.max
    )}&#176;</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;
    document.getElementById("output").innerHTML = output;
    localStorage.setItem("data", output);
  } else {
    throw new Error(response.statusText);
  }
}

document.getElementById("output").innerHTML = localStorage.getItem("data");

const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const api_params = {
    // Lat & Lon [35.6895, 139.6917], [6.5833, 3.75], [53.4809, -2.2374]
    lat: 6.5833,
    lon: 3.75,
    key: "f6c990b6f08026d30421f42c9d513c4a",
  };
  fetchWeatherAPI(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${api_params.lat}&lon=${api_params.lon}&units=metric&exclude=minutely&appid=${api_params.key}`
  ).catch((err) => alert(err.message));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js");
  });
}
