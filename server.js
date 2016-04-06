// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
	//mongoose.connect('mongodb://127.0.0.1:27017/test');
	
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

	  // define model =================
    var Food = mongoose.model('Food', {
       
		foodItem : String,
		price	: {type: Number, min: 0}
    });
	
	
	
	
	
	// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all foods
    app.get('/api/foods', function(req, res) {

        // use mongoose to get all foods in the database
        Food.find(function(err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
			
            res.json(foods); // return all foods in JSON format
        });
    });

	// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all foods
    app.get('/api/total', function(req, res) {

        // use mongoose to get all foods in the database
        Food.find(function(err, foods) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
			var total=0;
			foods.forEach(function(food){
				total += food.price;
			});
			total += 0.075*total;
			console.log(total);
            res.json(total); // return all foods in JSON format
        });
    });
	
    // create food and send back all foods after creation
    app.post('/api/foods', function(req, res) {

        // create a food, information comes from AJAX request from Angular
        Food.create({
            foodItem : req.body.foodItem,
			price: req.body.price,
            done : false
        }, function(err, food) {
            if (err)
                res.send(err);

            // get and return all the foods after you create another
            Food.find(function(err, foods) {
                if (err)
                    res.send(err)
                res.json(foods);
            });
        });

    });

    // delete a food
    app.delete('/api/foods/:food_id', function(req, res) {
        Food.remove({
            _id : req.params.food_id
        }, function(err, food) {
            if (err)
                res.send(err);

            // get and return all the foods after you create another
            Food.find(function(err, foods) {
                if (err)
                    res.send(err)
                res.json(foods);
            });
        });
    });

	   // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
