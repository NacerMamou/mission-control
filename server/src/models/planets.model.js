
const path = require('path');
const fs = require('fs');
const {parse} = require('csv-parse');


const planets = require("./planets.mongo");
//const habitablePlanets = [];

function isHabitable(planet){
	return planet['koi_disposition'] ==='CONFIRMED' 
		&& planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
		&& planet['koi_prad'] < 1.6;
}


async function loadPlanetsData(){
	return new Promise((resolve, reject)=>{
		
		fs.createReadStream( path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
		.pipe(parse({
		comment: '#',
		columns: true,
	}))
	
	.on('data', async (data) => {
		if(isHabitable(data)){
			//.create function is an asynchronous function
			//await planets.create(data);
			//passe the data in the same way as it is organised in the schema
			// have to replace create with upsort
			/*
			await planets.create({
				keplerName: data.kepler_name,
			});
			*/
			//habitablePlanets.push(data);
			await savePlanet(data);
	}
	
	})
	
	.on('error', (err) => {
		console.log(err);
		reject(err);
	})
	
	.on('end', async() => {
		const countPlanetsFound = (await getAllPlanets()).length;
		console.log(`${countPlanetsFound} habitable planets`);
		//console.log(await getAllPlanets());
		resolve();
		//console.log(`${habitablePlanets.length} habitable planets`);
		//resolve(habitablePlanets);
	});
	
});



}

async function getAllPlanets(){
	//return habitablePlanets;
	/*
	To precise what to finds
	return await planets.find({
		keplerName : "Kepler-62", 
	}, { 'keplerName': 0 });
	*/
	//find all planets
	return await planets.find({}, { _id: 0, __v: 0,});
}

async function savePlanet(planet){
	try{
		await planets.updateOne({
			keplerName: planet.kepler_name,
		}, {
			keplerName: planet.kepler_name,
		}, {
			upsert: true,
		});
	}catch(error){
		console.error(`Could not save Planet ${error}`);
	}
}

module.exports = {
	loadPlanetsData,
	getAllPlanets,
};
/*
const promise = new Promise((resolve, reject) => {
	resolve(42);
});
promise.then((reslult)=>{

});
const result = await promise;
console.log(result);
*/


