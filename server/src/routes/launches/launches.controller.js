//const { query } = require('express');
const { 
	getAllLaunches, 
	scheduleNewLaunch, 
	existsLaunchId, 
	abortLaunchById, } = require('../../models/launches.model');

const {
	getPagination,
} = require("../../services/query");

async function httpGetAllLaunches(req, res){
    
  //return res.status(200).json(Array.from(launches.values()));
	//console.log(req.query);
	const { skip, limit } = getPagination(req.query);
	const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res){
  
	const launch = req.body;
	if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
		return res.status(400).json({
			error :  'Bad request! Missing some launch proprety',
		});
	}
	/*
	if(launch.launchDate.toString() === 'Invalid Date'){
		return res.status(400).json({
			error : 'Invalid Launch Date'
		});
	}
	*/
	launch.launchDate = new Date(launch.launchDate);
	//console.log(new Date(launch.launchDate).valueOf());
	
	if( isNaN(new Date(launch.launchDate).valueOf()) ){
		return res.status(400).json({
			error : 'Invalid launch Date'
		});
	}
  
	//addNewLaunch(launch);
	//saveLaunch(launch);
	await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res){
	const launchId = parseInt(req.params.id);
	const existsLaunch = await existsLaunchId(launchId);
	if(!existsLaunch){
		return res.status(404).json({
			error: 'Launch not found',
		});
	}else{
		const aborted = await abortLaunchById(launchId);
		//return res.status(200).json(aborted);
		
		if (!aborted){
			return res.status(400).json({
				error: 'Launch is not aborted',
			});
		}
		return res.status(200).json({
			ok: true,
		});
		
	}
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};