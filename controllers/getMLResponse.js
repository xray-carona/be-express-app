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
                	model_type: req.body.params.model_type,
                	override_validation: 'true',
                    // input Xray image S3 url
                    // image_loc:'https://xray-corona-ds.s3.ap-south-1.amazonaws.com/uploaded-from-app/cee5a76b6bb5f506ccaa98b9365bd19c.jpg',
                    image_loc: req.body.params.url,

                    // JSON of patient info patientInfo={name: "test", isDryCough: "1", isSneezing: "0"
                    patientInfo: req.body.params.patientInfo,

                    userId: req.body.params.userId
                    // add other inputs to API as needed
                },
                headers: {'node-env': NODE_ENV}
            }
        ).then(function (response) {
            console.log('api response');
            console.log(response.data);
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
    console.log(req.body.params.userId);

  // call Flask API that runs ML model
  // return response as JSON
  if (req.body.params.model_type =='xray') {
  	// dummy response 
  	// res.json({annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png', covid_diagnosis: 'Patient diagnosis : Positive Covid', lung_conditions: {consolidation: { low_val: 10, this_val: 18, high_val: 100 }, fibrosis: { low_val: 0, this_val: 70, high_val: 100 }, atelectasis: { low_val: 0, this_val: 5, high_val: 100 }, pneumonia: { low_val: 0, this_val: 5, high_val: 100 }, emphysema: { low_val: 0, this_val: 13, high_val: 100 }, infiltration: { low_val: 0, this_val: 13, high_val: 100 } } }); var apiRes = callAPI(req);
  	var apiRes = callAPI(req);
	apiRes.then( response => {
			var lung_conditions = {};
			var idx = 0;
			Object.keys(response.result[0].chest).forEach(key => {
				// console.log(response.result.chest[key]);
				var result_boolean =  Object.values(response.result[0].chest[idx])[1];
				lung_conditions[Object.keys(response.result[0].chest[idx])[0]]= { low_val: 0, this_val: Object.values(response.result[0].chest[idx])[0], high_val: 100, result_boolean: result_boolean};
				idx++;
				}
			);
			console.log(lung_conditions);
			//TODO , move this front-end itself.
			covid_mapping={"Normal":"Negative","Non-COVID19 Viral":"Test","COVID-19 Viral":"Positive"}
		res.json({
			// add other response from API when ready
			// TODO , currently there is no annotated image for x_ray
			// annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png',
			covid_diagnosis: 'Patient diagnosis : '+covid_mapping[response.result[0].covid],
			lung_conditions: lung_conditions
		});
	}
	);
	} else if (req.body.params.model_type =='ct') {
	// dummy response 
	 // res.json({annotated_img_url: "https://xray-corona-ds.s3.ap-south-1.amazonaws.com/uploaded-from-app/ct-scans-output/1_95df5475-5951-423f-814b-4f7fdbf2b3c1.jpg", 
	  			// ct_results: [{"area_percentage": 5.002, "color": [255, 0, 0 ], "count": 13112, "key": 1, "legend": "Ground Glass"}, {"area_percentage": 1.665, "color": [0, 255, 0 ], "count": 4364, "key": 2, "legend": "Consolidations"}, {"area_percentage": 0.0, "color": [0, 0, 255 ], "count": 0, "key": 3, "legend": "Pleural effusion"} ] }); 
	  var apiRes = callAPI(req);
	  apiRes.then( response => {
			res.json({
				// add other response from API when ready
				annotated_img_url: response.result[0].image_url,
				ct_results: response.result[0].output_dict,
				// covid_diagnosis: 'Patient diagnosis : '+response.result[0].covid,
				// lung_conditions: lung_conditions
			});
		}
	  );
}
  
};

exports.getMLResponse = (req, res, next) => {
    console.log(req);
    getMLResponseFromAPI(req, res);
};