//Declaration of global variables required ie main sections needed from HTML file
var searchBtn=document.querySelector("#search");
var city=document.querySelector("#city");
var curr=document.querySelector("#now");
var forecast=document.querySelector("#forecast");

searchBtn.addEventListener("click", function(e){
    e.preventDefault();
    // Accu Weather API location Api call
    fetch("http://dataservice.accuweather.com/locations/v1/cities/search?apikey=R3eYGFHhFF0UxvY2rFI2KRojjK4emV26&q=" +city.value)
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            console.log("Data: ")
            console.log(data)
            // Accuweather current weather conditions api call
            fetch("http://dataservice.accuweather.com/currentconditions/v1/"+ data[0].Key + "?apikey=R3eYGFHhFF0UxvY2rFI2KRojjK4emV26&language=en&details=true")
                .then(function(r){
                    return r.json()
                })
                .then(function(d){
                    console.log("Current:");
                    console.log(d);
                    var bigCard = document.createElement("div");
                    bigCard.setAttribute("class", "card");
                    bigCard.classList.add("col-12");
                    var cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");
                    var h5 = document.createElement("h5");
                    var now = moment().format("DD/MM/YYYY")
                    h5.innerHTML=data[0].Country.EnglishName + " (" + now + ")";
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
                        uvNum.style.backgroundColor="green"
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
                    fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + data[0].Key+ "?apikey=R3eYGFHhFF0UxvY2rFI2KRojjK4emV26&details=true")
                        .then(function(response){
                            return response.json()
                        })
                        .then(function(dat){
                            console.log("New Data:");
                            console.log(dat);
                            // for(var i=0; i<dat.length;i++){

                            // }
                        })
                })
        })
})