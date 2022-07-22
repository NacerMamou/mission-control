
const http = require('http');
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./src/services/mongo');

const { loadPlanetsData } = require('./src/models/planets.model');
const { loadLaunchData } = require("./src/models/launches.model");

const server = http.createServer(app);
const PORT = process.env.PORT || 8008;


async function startServer(){
	await mongoConnect();
	await loadPlanetsData();
	await loadLaunchData();
	server.listen(PORT, ()=>{
		console.log(`Listening on port ${PORT}`)
	});
}
startServer();

