const mongoose       = require('mongoose');
const cachegoose     = require('cachegoose');
const Address        = require('../model/address');
const csrf           = require('csurf');
const async          = require('async');
const csrfProtection = csrf();

// get the list of address
module.exports.getListOfAddress = (req, res) => {
	let query = Address.find({})
				.cache(0, 'address-list-cache')
				.select({'__v': 0, 'dateCreated': 0});

	query.exec((err, address) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} 

		res.status(200).json({
			success   : true, 
			message   : 'Successfully fetched the list of address.',
			messages  : req.flash('message'),
			address   : address.length === 0 ? 'Address list is currently empty.' : address
		});
	});
};


// get the form for creating new address
module.exports.getCreateAddress = (req, res) => {
	res.status(200).json({
		message   : 'You are about to add a new address'
	});
};


// http post for creating new address
module.exports.postCreateAddress = (req, res) => {
	let address = new Address();

	address.appartment_name = req.body.appartment_name;
	address.city            = req.body.city
	address.full_address    = req.body.full_address;
	address.state           = req.body.state
	address.zip_code        = req.body.zip_code;

	address.save((err) => {
		if(err){
		    return res.status(500).json({success: false, message: 'Something went wrong.'});
		}

		cachegoose.clearCache('address-list-cache');

		req.flash('message', 'Successfully added a new address.');
		res.redirect('/api/address/list');
	});
};


// get the form for editing an address
module.exports.getEditAddress = (req, res) => {
	let query = Address.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, address) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} if(!address){
			return res.status(404).json({
				sucess  : false,
				message : 'The address you are looking for does not exist.'
			});
		}

		res.status(200).json({
			message   : 'You are about to edit this address',
			address   : address
		});
	});
};


// http put for updating a address
module.exports.putEditAddress = (req, res) => {
	async.waterfall([
		// find address by id
	    (callback) => {
	      	let query = Address.findById({ _id: req.params.id }).select({'__v': 0});

  	      	query.exec((err, address) => {
  		        if(!address){
        			return res.status(404).json({
        				sucess  : false,
        				message : 'The address you are looking for does not exist.'
        			});
        		}

  		        callback(err, address);
  	      	});
	    }, 
	    // update address
	    (address, callback) => {
	    	address.appartment_name = req.body.appartment_name;
	    	address.city            = req.body.city
	    	address.full_address    = req.body.full_address;
	    	address.state           = req.body.state
	    	address.zip_code        = req.body.zip_code;

	    	address.save(err => {
	    		callback(err, address);
	    	});
	    }], (err) => {
		    if(err) {
		    	return res.status(500).json({ 
		    		sucess  : false, 
		    		error   : err, 
		    		message : 'Something went wrong with the server.'
		    	});
		    }
		    req.flash('message', 'Successfully updated a address');
		    res.redirect(303, '/api/address/list');
	});
};


// get the form for editing a address
module.exports.getAddressDetails = (req, res) => {
	let query = Address.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, address) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} if(!address){
			return res.status(404).json({
				sucess  : false,
				message : 'The address you are looking for does not exist.'
			});
		}

		res.status(200).json({
			success : true,
			message : 'Successfully fetched the details of the address',
			address : address
		});
	});
};


// get the form for editing a address
module.exports.getDeleteAddress = (req, res) => {
	let query = Address.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, address) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} if(!address){
			return res.status(404).json({
				sucess  : false,
				message : 'The address you are looking for does not exist.'
			});
		}

		res.status(200).json({
			success : true,
			message : 'You are about to delete this address',
			address : address
		});
	});
};


// delete a address
module.exports.deleteAddress = (req, res) => {
	let query = Address.findOneAndRemove({ _id: req.params.id });

	query.exec((err, address) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Something went wrong with the server.'
			});
		} if(!address){
			return res.status(404).json({
				sucess  : false,
				message : 'The address you are looking for does not exist.'
			});
		}

		req.flash('message', 'Address has been successfully deleted.');
		res.redirect(303, '/api/address/list');
	});
};