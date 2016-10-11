const fetch = require('node-fetch');
const jsonfile = require('jsonfile');

const santanderOptions = {
  server: 'http://172.16.2.141',
  port: '55555',
  project: 'santander-customer-satisfaction'
};

const rossmanOptions = {
  server: 'http://172.16.2.27',
  port: '54321',
  project: 'rossman-store-sales'
};

const grupoBimboNaiveOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  combinedFrames: {
    'glm': 'gb_glm_combined_validation_prediction_deviance.hex',
    'drf': 'gb_drf_combined_validation_prediction_deviance.hex',
    'gbm': 'gb_gbm_combined_validation_prediction_deviance.hex'
  },
  ignoredColumns:'["Agencia_ID","Producto_ID","Cliente_ID","Semana","Canal_ID","Ruta_SAK","Venta_uni_hoy","Venta_hoy","Dev_uni_proxima","Dev_proxima","Demanda_uni_equil","NombreCliente","NombreProducto","Town","State","Demanda_uni_equil0"]'
}

const grupoBimboWeekSplitOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  combinedFrames: {
    'glm': 'combined-combined-validation.hex-predictions_8564_glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae_on_validation.hex-deviances_b3a1_glm-d7208b6f-ae13-4996-8c10-6be359f3e2ae_on_validation.hex',
    'drf': 'combined-combined-validation.hex-predictions_9b49_drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0_on_validation.hex-deviances_aebb_drf-b08c3eed-0806-4e41-b8f2-4b1d18812af0_on_validation.hex',
    'gbm': 'combined-combined-validation.hex-predictions_8182_gbm-a6210942-fe85-4709-b513-576351f70400_on_validation.hex-deviances_ba64_gbm-a6210942-fe85-4709-b513-576351f70400_on_validation.hex'
  },
  ignoredColumns:'["Agencia_ID","Producto_ID","Cliente_ID","Semana","Canal_ID","Ruta_SAK","Venta_uni_hoy","Venta_hoy","Dev_uni_proxima","Dev_proxima","Demanda_uni_equil","NombreCliente","NombreProducto","Town","State","Demanda_uni_equil0"]'
}

const grupoBimboDmitryFeaturesOptions = {
  server: 'http://172.16.2.141',
  port: '54321',
  radiusScale: '0.8',
  combinedFrames: {
    'glm': 'combined-combined-Bimbo_valid_processed.hex-predictions_b4e1_glm-2e52c7c0-dd22-4e76-8372-c2cbb7dd0141_on_Bimbo_valid_processed.hex-deviances_8f59_glm-2e52c7c0-dd22-4e76-8372-c2cbb7dd0141_on_Bimbo_valid_processed.hex',
    'drf': 'combined-combined-Bimbo_valid_processed.hex-predictions_99ce_drf-460f78d7-e5e3-4ea7-8a08-b877de724119_on_Bimbo_valid_processed.hex-deviances_86b2_drf-460f78d7-e5e3-4ea7-8a08-b877de724119_on_Bimbo_valid_processed.hex',
    'gbm': 'combined-combined-Bimbo_valid_processed.hex-predictions_9948_gbm-9a8e7868-3689-4f51-bdc6-5ea068478094_on_Bimbo_valid_processed.hex-deviances_8053_gbm-9a8e7868-3689-4f51-bdc6-5ea068478094_on_Bimbo_valid_processed.hex'
  },
  ignoredColumns:'["state2","address","Ruta_SAK","brand","cluster","Cliente_ID","Agencia_ID","Canal_ID","Producto_ID","Semana","Demanda_uni_equil","id","weight","pieces","weight_per_piece","has_choco","has_vanilla","has_multigrain","target","nProduct","productMeanLog","productMeanLog1","productMeanLog2","nClient","clientMeanLog","clientMeanLog1","clientMeanLog2","nProductClient","productClientMeanLog","nProductClient2","productClientMeanLog2","productClientMeanLog3","ntrIn","trIn","nbrand","brandmn","ngeo","geomn","ngeo2","geomn2","nbrand2","brandmn2","ngeo3","geomn3","ngeo4","geomn4","nbrand_cl","brandmn_cl","nbrand2_cl","brandmn2_cl","target0"]'
}

function aggregate(options, frame) {
  const server = options.server;
  const port = options.port;
  const model_id = 'aggregator-b4209a31-b303-4e9d-89b7-cdd11228iu7ip';
  const training_frame = frame;
  const ignored_columns = options.ignoredColumns;
  const ignore_const_cols = 'true';
  const radius_scale = options.radiusScale; // '0.6'; // '0.05'; // '0.005';
  const categorical_encoding = 'AUTO';
  const transform = 'NORMALIZE';
  const fetchOptions = { 
    method: 'POST',
    body: `model_id=${model_id}&training_frame=${training_frame}&ignored_columns=${ignored_columns}&ignore_const_cols=${ignore_const_cols}&radius_scale=${radius_scale}&categorical_encoding=${categorical_encoding}&transform=${transform}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  // 
  fetch(`${server}:${port}/99/ModelBuilders/aggregator`, fetchOptions)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
    });
}

// example
// aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.glm);
// aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.drf);
aggregate(grupoBimboDmitryFeaturesOptions, grupoBimboDmitryFeaturesOptions.combinedFrames.gbm);