//var launches = new Map();
const launchesDataBase = require('./launches.mongo');
const planets =require('./planets.mongo');
const axios = require('axios');

//const launches = require('./launches.mongo');

//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
/*
const launch1 = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    customers: ['ZTM', 'NASA'],
    target: 'Kepler-442 b',
    upcoming: true,
    success: true,
};

saveLaunch(launch1);
*/


//launches.set(launch1.flightNumber, launch1);

async function existsLaunchId(launchId){
   // return await launchesDataBase.findOne({ flightNumber: launchId });
   return findLaunch({ flightNumber: launchId }) ;
}

async function abortLaunchById(launchId){
    const aborted = await launchesDataBase.updateOne({
        flightNumber: launchId }, {
            upcoming: false, 
            success: false, 
        });
    return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDataBase
    .findOne()
    .sort('-flightNumber');
    
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit){
    return await launchesDataBase
    .find({}, { '__v': 0,})
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch){
        //await launchesDataBase.updateOne({
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch,{
        upsert: true,
    });
        //latestFlightNumber++;
    
}
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
    console.log("Downloading data from Space X Api");
    const response = await axios.post(SPACEX_API_URL, {
        query:{},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        'name': 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                    customers: 1
                    }
                
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_utc'],
            upcoming: launchDoc['upcoming'],
            customers,

        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if(firstLaunch){
        console.log(`Launch data already loaded`);
    }else{
        await populateLaunches();
    }
    
    
}

async function findLaunch(filter){
    return await launchesDataBase.findOne(filter);
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({ keplerName: launch.target });
    if(!planet){
        throw new Error("No matching planet is found");
    }

    const newFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA' ],
        flightNumber: newFlightNumber,
    });
    await saveLaunch(newLaunch);
}
/*
function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        success: true, 
        upcoming: true,
        customers : ['Zero to mastery', 'NASA'],
        flightNumber: latestFlightNumber,
    }) );
}
*/
module.exports = {
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    existsLaunchId,
    abortLaunchById,
    loadLaunchData,
};