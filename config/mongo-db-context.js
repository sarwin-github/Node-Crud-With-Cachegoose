const session    = require('express-session');
const mongoose   = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const cachegoose     = require('cachegoose');
const MongoEngine    = require('cacheman-mongo');

// Local connection
const mongoConnectionLocal = {	
	'url': `mongodb://127.0.0.1:27017/address-database`
};

// Development database from mongolab
const mongoConnectionOnline = {
	'url': `mongodb://${process.env.MLabDBUser}:${process.env.MLabDBPassword}@${process.env.MLabAddress}/my-database`
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {

	let options = {
	  auth: {authdb: 'admin'},
	  user: process.env.MongoDBLocalUser,
	  pass: process.env.MongoDBLocalPassword,
	}

	mongoose.Promise = global.Promise;

	switch (env) {
	    case 'dev':
	    	app.set('port', process.env.PORT || 9001);

	        mongoose.connect(mongoConnectionOnline.url, 
	        	err => { 
	        		if(err) { console.log(err); }

	        		//Set cachegoose
	        		cachegoose(mongoose, {
	        			engine : new MongoEngine(mongoConnectionOnline.url, { collection : 'cache-collection' }),
	        			port   : 9001,      
	        			host   : 'localhost'
	        		});
	        	}); 
	        break;
		case 'local':
	    	app.set('port', process.env.PORT || 9001);
	        mongoose.connect(mongoConnectionLocal.url, options,  
	        	err => { 
	        		if(err) { console.log(err); }

	        		//Set cachegoose
	        		cachegoose(mongoose, {
	        			engine : new MongoEngine(mongoConnectionLocal.url, { collection : 'cache-collection' }),
	        			port   : 9001,      
	        			host   : 'localhost'
	        		});
	        	});
			break;
	};

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: true, 
		store  : new mongoStore({ mongooseConnection: mongoose.connection }),
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

