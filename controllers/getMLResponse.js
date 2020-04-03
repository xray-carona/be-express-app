var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

const getMLResponseFromAPI = (req,res) => {
  
  // call API that runs ML model
  // return response as string 
  // req.url should have S3 url
  console.log(req.body);
  console.log('test-logs');
  console.log(req.body.url);
  res.json({ 
  	annotated_img_url: 'https://xray-corona.s3.ap-south-1.amazonaws.com/1_annotated.png',
  	covid_diagnosis: req.patientInfo.name 
  });
};

exports.getMLResponse = ( req, res, next ) => {
  console.log(req);
  getMLResponseFromAPI(req,res);
};