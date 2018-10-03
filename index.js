var SERVER_NAME = 'Assignment-1';
var PORT = 3000;
var HOST = '127.0.0.1';
var getRequestCounter = 0;
var postRequestCounter = 0;



var restify = require('restify')

  // Get a persistence engine for the users
  var productSave = require('save')('products');


  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log(' http://127.0.0.1:3000/sendGet method: GET  -> to get all product  ')
  console.log(' http://127.0.0.1:3000/sendPost method: POST -> to create new product')  
  console.log(' http://127.0.0.1:3000/sendDelete method: DELETE -> to delete  product')  

})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get a all product information
server.get('/sendGet', function (req, res, next) {
  getRequestCounter++;

  // Find every entity within the given collection
  productSave.find({}, function (error, products) {

    // Return all of the product in the system
    res.send(products)
  })
  console.log(" Processed Request Count --> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
})
// Create a new product
server.post('/sendPost', function (req, res, next) {
  postRequestCounter++;

  // Make sure product is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    console.log(" Processed Request Count --> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    console.log(" Processed Request Count --> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newProduct = {
		product: req.params.product, 
		price: req.params.price
	}

  // Create the product using the persistence engine
  productSave.create( newProduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
  console.log(" Processed Request Count --> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
})

// Delete all product 
server.del('/sendDelete', function (req, res, next) {

  // Delete the product with the persistence engine
  productSave.deleteMany({}, function (error, products) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})



// GET-diagram

// User->Web API: HTTP Request
// Note right of User: sendGet
// Web API->Data: get products
// Data-->Web API: show all products
// Web API-->User: HTTP Response
// Note right of User: {product:"item",price:"price",id:"id"}




// Post-diagram

// User->Web API: HTTP Request
// Note right of User: sendPost: \n{product:pencil, price: 5}
// Web API->Data: Add Product
// Data-->Web API: added product to list
// Web API-->User: HTTP Response
// Note right of User: {_id: "id", pencil, 5}