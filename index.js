var SERVER_NAME = 'Assignment-1'
var PORT = 8000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the users
  , usersSave = require('save')('sendGet')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log(' http://127.0.0.1:3000/sendGet method: GET')
  console.log(' http://127.0.0.1:3000/sendPost method: POST')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all users in the system
server.get('/sendGet', function (req, res, next) {

  // Find every entity within the given collection
  usersSave.find({}, function (error, sendGet) {

    // Return all of the users in the system
    res.send(sendGet)
  })
})

// Get a single user by their user id
server.get('/sendGet/:id', function (req, res, next) {

  // Find a single user by their id within save
  usersSave.findOne({ _id: req.params.id }, function (error, sendGet) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (sendGet) {
      // Send the user if no issues
      res.send(sendGet)
    } else {
      // Send 404 header if the user doesn't exist
      res.send(404)
    }
  })
})

// Create a new user
server.post('/sendPost', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newUser = {
		name: req.params.name, 
		age: req.params.age
	}

  // Create the user using the persistence engine
  usersSave.create( newUser, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, user)
  })
})

// Update a user by their id
server.put('/sendGet/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  
  var newUser = {
		_id: req.params.id,
		name: req.params.name, 
		age: req.params.age
	}
  
  // Update the user with the persistence engine
  usersSave.update(newUser, function (error, sendGet) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/sendGet/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  usersSave.delete(req.params.id, function (error, sendGet) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


