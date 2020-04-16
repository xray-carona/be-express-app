const axios = require('axios');
const config = require('../config');
const ML_BASE_URL = config.ML_BASE_URL
const NODE_ENV = config.NODE_ENV

const callAPI = (req) => {
    try {
        return axios.get(
            ML_BASE_URL,
            {
                params: {
                    // input Xray image S3 url
                    // image_loc:'https://xray-corona-ds.s3.ap-south-1.amazonaws.com/uploaded-from-app/cee5a76b6bb5f506ccaa98b9365bd19c.jpg',
                    image_loc: req.body.params.url,

                    // JSON of patient info patientInfo={name: "test", isDryCough: "1", isSneezing: "0"
                    patientInfo: req.body.params.patientInfo

                    // add other inputs to API as needed
                },
                headers: {'node-env': NODE_ENV}
            }
        ).then(function (response) {
            // console.log('api response'+response.data);
            return response.data;
        })
    } catch (error) {
        console.error(error)
    }
}

const getMLResponseFromAPI = (req, res) => {

    console.log('express-logs in getMLResponseFromAPI'); // docker logs be-express-app
    console.log(req.body.params.url);
    console.log(req.body.params.patientInfo);

  // dummy response 
  // res.json({
		// 	annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png',
		// 	covid_diagnosis: 'Patient diagnosis : Test Covid',
		// 	lung_conditions: {
		// 		consolidation: { low_val: 10, this_val: 18, high_val: 100 },
  //   			fibrosis: { low_val: 0, this_val: 70, high_val: 100 },
  //   			atelectasis: { low_val: 0, this_val: 5, high_val: 100 },
  //   			pneumonia: { low_val: 0, this_val: 5, high_val: 100 },
  //   			emphysema: { low_val: 0, this_val: 13, high_val: 100 },
  //   			infiltration: { low_val: 0, this_val: 13, high_val: 100 }
  //   		}
		// });

  // call Flask API that runs ML model
  // return response as JSON
  // curl --location --request GET 'http://flask-backend.xray.ronalddas.com/predict?image_loc=https://raw.githubusercontent.com/xray-carona/data-modeling/master/data/test/person1949_bacteria_4880.jpeg' \
  // --header 'node-env: prod'
  var apiRes = callAPI(req);
  apiRes.then( response => {
  		var lung_conditions = {};
  		var idx = 0;
  		Object.keys(response.result.chest).forEach(key => {
  			// console.log(response.result.chest[key]);
  			var result_boolean =  Object.values(response.result.chest[idx])[1];
  			lung_conditions[Object.keys(response.result.chest[idx])[0]]= { low_val: 0, this_val: Object.values(response.result.chest[idx])[0], high_val: 100, result_boolean: result_boolean};
  			idx++;
  			}
  		);
  		console.log(lung_conditions);
		res.json({
			// add other response from API when ready
			// annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png',
			covid_diagnosis: 'Patient diagnosis : '+response.result.covid,
			lung_conditions: lung_conditions
		});
	}
  );
  
};

exports.getMLResponse = (req, res, next) => {
    console.log(req);
    getMLResponseFromAPI(req, res);
};