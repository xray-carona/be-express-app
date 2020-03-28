const getMLResponseFromAPI = (req,res) => {
  
  // call API that runs ML model
  // return response as string 
  // req.url should have S3 url
  res.json("Patient suffering from COVID-19");
};

exports.getMLResponse = ( req, res, next ) => {
  console.log(req);
  getMLResponseFromAPI(req,res);
};