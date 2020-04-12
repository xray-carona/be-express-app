function index(request, response) {
  console.log('home controller');
  response.json('This is home route');
}

module.exports = {
  index: index
};