const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Alpr = new Schema ({
        plate: { type: String},
        email: {type: String},
        enter_date: { type: Date, default: Date.now },
        exit_date: { type: Date }

});

module.exports = mongoose.model('Alpr', Alpr)
