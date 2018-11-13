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
		statusOne().then((output) => {
		statone = output;
  });

 if (cmd == 'what'){
	res.json({ 'fulfillmentText': 'The state of the lamp is' + statone + ''});
 }
 if (state == 'on') {
	if(statone == '0'){
	lampOneON().then((output) => {
    res.json({ 'fulfillmentText': output }); 
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
	}
	else if(statone == '1') {
res.json({ 'fulfillmentText': 'The lamp is already on' });
 }
   	else {
    res.json({ 'fulfillmentText': 'something is wrong with lamp code' });
 }
 }
 if(state == 'off') {
	if(statone == '1') {
	lampOneOFF().then((output) => {
    res.json({ 'fulfillmentText': output });
  }).catch(() => {
    res.json({ 'fulfillmentText': 'something is wrong' });
  });
	}
	else if (statone == '0') {
	res.json({ 'fulfillmentText': 'The lamp is already off' });
 }
   	else {
    res.json({ 'fulfillmentText': 'something is wrong with lamp code' });
 }
 }
 }
 
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

function statusOne () {
    return new Promise((resolve, reject) => {
	
    https.get('https://api.thingspeak.com/channels/592740/feeds.json?results=1', (res) => {
      let body = ''; 
      res.on('data', (d) => { body += d; }); 
      res.on('end', () => {
        let response = JSON.parse(body);
        let output = response.feeds[0].field1;
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

    https.get('https://api.thingspeak.com/update?api_key=TOVVVTT2PA4I9HB5&field1=1', (res) => {
      let body = ''; 
      res.on('data', (d) => { body += d; }); 
      res.on('end', () => {
        let response = JSON.parse(body);
        let output = response.feeds[0].field1;
        if (response == 0) {
      		output = 'Something is wrong, try later';
        }
        	else {
			output ='The lamp is now on';
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

function lampOneOFF () {
    return new Promise((resolve, reject) => {
	
    https.get('https://api.thingspeak.com/update?api_key=TOVVVTT2PA4I9HB5&field1=0', (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {

        let output = 'Turning off lamp';

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

