var path = require('path');

const fetch = require('node-fetch');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');

const bodyParser = require('body-parser');

var cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static('dist'));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


console.log(__dirname)

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

app.get("/test", function (req, res) {
  res.send(mockAPIResponse);
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'))//For building with build-prod
  //res.sendFile(path.resolve("src/client/views/index.html"));//For testing with build-dev
})


app.get('/all', function (req, res) {
    res.send(projectData);
});

app.post("/callAPI", async (req, res) => {
  let newData = req.body;
	console.log(req.body);

	let newEntry = {
		    city: newData.city,
        country: newData.country,
        countdown: newData.countdown,
        latitude: newData.latitude,
        longitude: newData.longitude,
        maxTemp: newData.max,
        minTemp: newData.min,
        description: newData.description,
        image: newData.imageURL
	}
	projectData = newEntry;
  
	console.log(projectData);
  res.send(projectData);
  });

