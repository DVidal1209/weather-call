//Declaration of global variables required ie main sections needed from HTML file
var searchBtn=document.querySelector("#search");
var city=document.querySelector("#city");
var curr=document.querySelector("#now");
var forecast=document.querySelector("#forecast");
var previous=document.querySelector("#previous");
var prev = $("#previous");
var previousSearch = [];

function search(e){
    e.preventDefault();
    forecast.innerHTML="";
    curr.innerHTML="";
    if (e.target.classList.contains("oldSearch")){
        city.value = e.target.innerHTML;
        console.log(e.target.className);
    }
    // Accu Weather API location Api call
    fetch("https://dataservice.accuweather.com/locations/v1/cities/search?apikey=Igdknb5TJC9Zne9mSH20UI9Vzn5C0CzM&q=" +city.value)
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            // Accuweather current weather conditions api call
            fetch("https://dataservice.accuweather.com/currentconditions/v1/"+ data[0].Key + "?apikey=Igdknb5TJC9Zne9mSH20UI9Vzn5C0CzM&language=en&details=true")
                .then(function(r){
                    return r.json()
                })
                .then(function(d){
                    var bigCard = document.createElement("div");
                    bigCard.setAttribute("class", "card");
                    bigCard.classList.add("col-12");
                    var cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");
                    var h5 = document.createElement("h5");
                    var now = moment().format("YYYY/MM/DD")
                    h5.innerHTML=data[0].EnglishName + " (" + now + ")";
                    var img = document.createElement("img");
                    img.setAttribute("src", "./assets/images/"+d[0].WeatherIcon+".png");
                    h5.appendChild(img);
                    var temp = document.createElement("p");
                    temp.innerHTML= "Temperature: " + d[0].Temperature.Imperial.Value + d[0].Temperature.Imperial.Unit;
                    var wind = document.createElement("p");
                    wind.innerHTML="Wind Speed: " + d[0].Wind.Speed.Imperial.Value + d[0].Wind.Speed.Imperial.Unit;
                    var humidity = document.createElement("p");
                    humidity.innerHTML = "Humidity: " + d[0].RelativeHumidity + "%";
                    var uv = document.createElement("p");
                    uv.innerHTML ="UV Index: ";
                    var uvNum = document.createElement("span");
                    uvNum.innerHTML =  d[0].UVIndex;

                    //Color Coding of UV Index
                    if (d[0].UVIndex<=2){
                        uvNum.style.backgroundColor="lightgreen"
                    } else if(d[0].UVIndex>=3 && d[0].UVIndex<=5){
                        uvNum.style.backgroundColor="yellow"
                    } if(d[0].UVIndex>=6 && d[0].UVIndex<=7){
                        uvNum.style.backgroundColor="orange"
                    } if(d[0].UVIndex>=8 && d[0].UVIndex<=10){
                        uvNum.style.backgroundColor="red"
                    } if(d[0].UVIndex>=11){
                        uvNum.style.backgroundColor="purple"
                    }
                    uv.appendChild(uvNum);
                    bigCard.appendChild(h5);
                    bigCard.appendChild(temp);
                    bigCard.appendChild(wind);
                    bigCard.appendChild(humidity);
                    bigCard.appendChild(uv);
                    curr.appendChild(bigCard);
                    // Accuweather future weather conditions api call
                    fetch("https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + data[0].Key+ "?apikey=Igdknb5TJC9Zne9mSH20UI9Vzn5C0CzM&details=true")
                        .then(function(response){
                            return response.json()
                        })
                        .then(function(dat){
                            for(var i=0; i<dat.DailyForecasts.length;i++){
                                var smallCard = document.createElement("div");
                                smallCard.setAttribute("class", "card");
                                smallCard.classList.add("smallCard");
                                var cardBody = document.createElement("div");
                                cardBody.classList.add("card-body");
                                var h5 = document.createElement("h5");
                                var date = dat.DailyForecasts[i].Date.substring(0,10)
                                h5.innerHTML=date;
                                var img = document.createElement("img");
                                img.setAttribute("src", "./assets/images/"+dat.DailyForecasts[i].Day.Icon+".png");
                                h5.appendChild(img);
                                var temp = document.createElement("p");
                                temp.innerHTML= "Temperature: " + dat.DailyForecasts[i].Temperature.Minimum.Value + dat.DailyForecasts[i].Temperature.Minimum.Unit + " - "+ dat.DailyForecasts[i].Temperature.Maximum.Value + dat.DailyForecasts[i].Temperature.Maximum.Unit;
                                var wind = document.createElement("p");
                                wind.innerHTML="Wind Speed: " + dat.DailyForecasts[i].Day.Wind.Speed.Value + dat.DailyForecasts[i].Day.Wind.Speed.Unit;
                                smallCard.appendChild(h5);
                                smallCard.appendChild(temp);
                                smallCard.appendChild(wind);
                                forecast.appendChild(smallCard);
                            }

                            previousSearch.unshift(city.value);
                            localStorage.setItem("previousSearch", JSON.stringify(previousSearch));

                            if (previousSearch.length>5){
                                previousSearch.pop();
                                localStorage.setItem("previousSearch", JSON.stringify(previousSearch));
                            }
                            previous.innerHTML = "";
                            for (var i=0;i<previousSearch.length;i++){
                                var btn = document.createElement("button");
                                btn.setAttribute("class", "col-12");
                                btn.classList.add("oldSearch");
                                btn.innerHTML=previousSearch[i];
                                previous.appendChild(btn);
                            }
                        })
                })
        })
}

function init(){
    if (localStorage.previousSearch === null || localStorage.previousSearch === undefined){
        return;
    } else{
        previousSearch = JSON.parse(localStorage.getItem("previousSearch"));
        for (var i=0;i<previousSearch.length;i++){
            var btn = document.createElement("button");
            btn.setAttribute("class", "col-12");
            btn.classList.add("oldSearch");
            btn.innerHTML=previousSearch[i];
            previous.appendChild(btn);
        }
    }
}

init();  

searchBtn.addEventListener("click", search)
prev.on("click", ".oldSearch", search)