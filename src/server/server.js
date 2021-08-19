// Setup empty JS object to act as endpoint for all routes
projectData = {};

//Set up Server
const express = require('express');
const app = express();

//Middleware
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(__dirname)

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})


app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'))
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
        maxTemp: newData.maxTemp,
        minTemp: newData.minTemp,
        description: newData.description,
        image: newData.image
	}
	projectData = newEntry;

	console.log(projectData);
  });
  
  
