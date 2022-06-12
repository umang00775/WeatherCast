const express = require("express");
const https = require('https');
const ejs = require('ejs');
const app = express();
const browserEnv = require('browser-env'); 
browserEnv(['navigator']);
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.post('/weather',(req,res)=>{
    let city_name = String(req.body.city);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=75d726febd1db917e409c194b70ddabc&units=metric#`;

    
    https.get(url,(resp)=>{
        resp.on('data',(data)=>{
            let weather_data = JSON.parse(data);
            let icon_link = "http://openweathermap.org/img/wn/" + weather_data.weather[0].icon + "@2x.png";
            let printable_data = "<h1>City : " + city_name + "</h1>"
                               + "<h1>Latitude : " + weather_data.coord.lat + "</h1>"
                               + "<h1>Longitude : " + weather_data.coord.lon + "</h1>"
                               + "<h1>Weather : " + weather_data.weather[0].main + "</h1>"
                               + "<h1>Temperature : " + weather_data.main.temp + " °C" + "</h1>"
                               + "<h1>Humidity : " + weather_data.main.humidity + "</h1>"
                               + "<h1>Wind(speed) :" + weather_data.wind.speed + "</h1>"
                               + `<h1>Icon : <img src=${icon_link} height="45px" width="45px"></h1>`;
            res.send(printable_data);
            
        })
    }).on('error',(e)=>{
        console.error(e);
    });
});


app.post('/see_weather',(req,res)=>{
    const code = Number(req.body.successCode);
    if(code === 100){
        const latitude = Number(req.body.latitude);
        const longitude = Number(req.body.longitude);
        let tempC, tempF, tempK, main, city_name, imgLink, windSpeed, windDegree, humidity, visibility, timeZone, sunrise, sunset, pressure;
        let url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=75d726febd1db917e409c194b70ddabc&units=metric#`;
        https.get(url1,(resp)=>{
            resp.on('data',(d)=>{
                const weather_data = JSON.parse(d);
                const data = {
                    tempC : weather_data.main.temp,
                    tempF : weather_data.main.temp*(9/5) + 32,
                    tempK : (weather_data.main.temp + 273.15),
                    main : weather_data.weather[0].main,
                    city_name : weather_data.name,
                    imgLink : "http://openweathermap.org/img/wn/" + weather_data.weather[0].icon + "@2x.png",
                    windSpeed : weather_data.wind.speed,
                    humidity : weather_data.main.humidity,
                    visibility : weather_data.visibility,
                    windDegree : weather_data.wind.deg,
                    timeZone : weather_data.timezone,
                    sunrise : weather_data.sys.sunrise,
                    sunset : weather_data.sys.sunset,
                    pressure : weather_data.main.pressure,
                };
                res.render('show_weather', {data : data});
            });
        }).on('error',(e)=>{
            console.error(e);
        });
    }
    else{
        res.sendFile(__dirname + "/noGeoLocation.html")
    }
});


app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});