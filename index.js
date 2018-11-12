'use strict';

const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

const host = 'api.thingspeak.com';
var statone;
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/webhooktest", function(req, res) {

 let Unit = req.body.queryResult.parameters['Unit'];
 let state = req.body.queryResult.parameters['state'];
 let cmd = req.body.queryResult.parameters['cmd'];
 
 if (Unit == 'lamp'){
	 	lampOneOFF.then((output) => {
  });
		statusOne().then((output) => {
		statone = output;
  });

 if (cmd == 'what'){
	res.json({ 'fulfillmentText': 'The state of the lamp is' + statone + ''});
 }
 if (state == 'on') {
	if(statone != '1'){
	lampOneON().then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
	}
	else //if(statone == '1') 
	{
res.json({ 'fulfillmentText': 'The lamp is already on' });
 }
 }
 if(state == 'off') {
	if(statone == '1') {
	lampOneOFF().then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
	}
	else //if (statone == '0')
	{
	res.json({ 'fulfillmentText': 'The lamp is already off' });
 }
 }
  	else {

    res.json({ 'fulfillmentText': 'something is wrong with lamp code' });
 
	

 }
 }
 
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});



function statusOne () {
    return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    //let path = '/update?api_key=116UAXMQP1O8EYZ3&field1=1';
    // Make the HTTP request
	
    https.get('https://api.thingspeak.com/channels/592740/feeds.json?results=1', (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let statone = response.feeds[0].field1;
        // Create response
        let output = statone;

        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log('Error calling API')
        reject();
      });
    });
  });
}



function lampOneON () {
    return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    //let path = '/update?api_key=116UAXMQP1O8EYZ3&field1=1';
    // Make the HTTP request
	
    https.get('https://api.thingspeak.com/update?api_key=TOVVVTT2PA4I9HB5&field1=1', (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        //let response = JSON.parse(body);
        //let last = response['field1'];
        // Create response
        let output = 'Turning on lamp';
		if (output != '1'){
			output = 'Lamp did not turn on';
		}
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log('Error calling API')
        reject();
      });
    });
  });
}


function lampOneOFF () {
    return new Promise((resolve, reject) => {
	
    https.get('https://api.thingspeak.com/update?api_key=TOVVVTT2PA4I9HB5&field1=0', (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {

        let output = 'Turning off lamp';
		if (output != 0){
			output = 'Lamp did not turn off';
		}

        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log('Error calling API')
        reject();
      });
    });
  });
}


