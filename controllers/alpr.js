var Alpr = require('../models/alpr');
const crypto = require('crypto');

exports.create = async function (req) {
    let car = await Alpr.findOne({plate: req.results[0].plate, exit_date: null})
    if (car) {
        car.exit_date = Date.now();
        await car.save();
    } else {
        let newAlpr = new Alpr({
            uuid: crypto.randomUUID(),
            plate: req.results[0].plate
        })
        try {
            await newAlpr.save();
            console.log(newAlpr);
        } catch (err) {
            console.log(err);
        }
    }

};


