
const express = require('express');
const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res){
    //You have to call the function using () to get the data
    //return res.status(200).json( function_name ());
    return res.status(200).json(await getAllPlanets());
}

module.exports = { httpGetAllPlanets, };


