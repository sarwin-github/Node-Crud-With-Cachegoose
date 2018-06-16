const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
	appartment_name : { type: String, required: true },
	city            : { type: String, required: true },
	full_address    : { type: String, required: true },
	state           : { type: String, required: true },
	zip_code        : { type: String, required: true },
});

module.exports = mongoose.model('Address', addressSchema);