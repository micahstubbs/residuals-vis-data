const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const fs = require('fs');
const _ = require('lodash');

const configFile = 'grupoBimboDmitryFeaturesOptions.json';
let outputOptions;

const filePath = `../config/${configFile}`;
fs.readFile(filePath, 'utf8', callback);
function callback(error, data) {
  const config = JSON.parse(data);  
  outputOptions = _.cloneDeep(config);
  outputOptions.predictionFrames = {};
  outputOptions.deviancesFrames = {};
  predict(config);
}

function predict(options) {
  const modelIDs = options.modelIDs;
  const model = modelIDs[0];
  const validationFrame = options.validationFrame;
  const server = options.server;
  const port = options.port;
  const fetchOptions = { 
    method: 'POST',
    body: 'deviances=true',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log(`generating predictions from model ${model} on validation frame ${validationFrame}`);
  fetch(`${server}:${port}/3/Predictions/models/${model}/frames/${validationFrame}`, fetchOptions)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
        outputOptions.predictionFrames[model] = json.predictions_frame.name;
        outputOptions.deviancesFrames[model] =  json.deviances_frame.name;

        if (modelIDs.length > 1) {
          // there are more models, so predict again
          let remainingModelIDs = modelIDs.slice(1,modelIDs.length);
          const newOptions = {
            server: options.server,
            port: options.port,
            validationFrame: options.validationFrame,
            modelIDs: remainingModelIDs
          }
          // recursion!
          predict(newOptions);
        } else {
          // if not, write out the accumulated 
          // predictionFrames and deviancesFrames
          // to our new config file
          // this will overwrite our old config file
          // that is ok
          const outputJsonObj = outputOptions;
          const outputFile = filePath;
          jsonfile.writeFile(outputFile, outputJsonObj, {spaces: 2}, function(err){
            console.log(err)
          })
        }
    });
}
