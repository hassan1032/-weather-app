const http = require("http");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

require('dotenv').config();
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=3707d304d92f8838b6c67301d30c36b2`)
      .then(response => {
        const objdata = response.data;
        const arrData = [objdata];
        const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(realTimeData);
        res.end();
      })
      .catch(error => {
        console.error('Error:', error);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end("Error fetching weather data");
      });
  } else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/css' });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(data);
        res.end();
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end("File not found");
  }
});

// server.listen(8000, "127.0.0.1");
server.listen(8000, "127.0.0.1", () => {
  console.log('Server is running at http://127.0.0.1:8000/');
});
