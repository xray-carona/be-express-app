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
                    image_loc: req.query.url,

                    // JSON of patient info patientInfo={name: "test", isDryCough: "1", isSneezing: "0"
                    patientInfo: req.query.patientInfo

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
    console.log(req.query.url);
    console.log(req.query.patientInfo);

    // call Flask API that runs ML model
    // return response as JSON
    // curl --location --request GET 'http://flask-backend.xray.ronalddas.com/predict?image_loc=https://raw.githubusercontent.com/xray-carona/data-modeling/master/data/test/person1949_bacteria_4880.jpeg' \
    // --header 'node-env: prod'
    var apiRes = callAPI(req);
    apiRes.then(response => {
            res.json({
                // add other response from API when ready
                annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png',
                covid_diagnosis: 'Patient diagnosis : ' + response.result
            });
        }
    );
};

exports.getMLResponse = (req, res, next) => {
    console.log(req);
    getMLResponseFromAPI(req, res);
};