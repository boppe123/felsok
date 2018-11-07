'use strict';

const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

const host = 'api.thingspeak.com';

var Unit;
var state;
var cmd;
var temp;
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/webhooktest", function(req, res) {

 Unit = req.body.queryResult.parameters['Unit']; // take out the Unit, lamp e.g.
 state = req.body.queryResult.parameters['state']; // take out the the state, on or off
 cmd = req.body.queryResult.parameters['cmd'];
 
 if (Unit == 'lamp'){
	   callThingApi().then((output) => {
		   temp = output;
    res.json({ 'fulfillmentText': temp });
  });
 
 if (state == 'on' && temp == '1') {  
	 res.json({ 'fulfillmentText': 'The lamp is already on' });
 }
 if (state == 'off' && temp == '0'){
	 res.json({ 'fulfillmentText': 'The lamp is already off' });
 }
 if(state == 'on' && temp != '1') {
	 	 callThingApiON().then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
 }
 if (state == 'off' && temp != '0'){
	 	callThingApiOFF().then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  }); 
 }
 }
 
});

 /*
  if (cmd == 'turn' && Unit == 'lamp'){
    if (state == 'on' && temp == '1') 
         res.json({ 'fulfillmentText': 'The lights are already on' }); // If the lights are already on
        } else {
          turnLightON().then((output) => {
            res.json({ 'fulfillmentText': output });
          });
        };
      
  
    if (state == 'off') {
      getStateOfLight().then((output) => {
        if (output == 0) {
         res.json({ 'fulfillmentText': 'The lights are already off' }); // If the lights are already off
        } else {
          turnLightOFF().then((output) => {
            res.json({ 'fulfillmentText': output });
          });
   
});
  
  

 else {
	    returnError().then((ret) => {
    res.json({ 'fulfillmentText': ret }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
	 
 }
});
	)};
*/

function returnError(){
    return new Promise((resolve, reject) => {
        let ret = ' Bad code u noob ';
        console.log(ret);
        resolve(ret);
      });
      res.on('error', (error) => {
        console.log('Error calling API')
        reject();
      });
    }



restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});



function callThingApi () {
    return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    //let path = '/update?api_key=116UAXMQP1O8EYZ3&field1=1';
    // Make the HTTP request
	
    https.get('https://api.thingspeak.com/channels/592740/feeds.json?results=2', (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let temp = response.feeds[0].field1;
        // Create response
        let output = temp;

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



function callThingApiON () {
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
        let output = 'The lamp is now on';

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

function callThingApiOFF () {
    return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    //let path = '/update?api_key=116UAXMQP1O8EYZ3&field1=0';
    // Make the HTTP request
	
    https.get('https://api.thingspeak.com/update?api_key=TOVVVTT2PA4I9HB5&field1=0', (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        //let response = JSON.parse(body);
        //let last = response['field1'];
        // Create response
        let output = 'The lamp is now off';

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


