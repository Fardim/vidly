const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);

const Rental = mongoose.model(
    "rental",
    new mongoose.Schema({
        customer: {
            type: new mongoose.Schema({
                name: {
                    type: String,
                    required: true,
                    min: 5,
                    max: 50
                },
                isGold: {
                    type: Boolean,
                    default: false
                },
                phone: {
                    type: String,
                    required: true,
                    min: 5,
                    max: 50
                }
            })
        },
        movie: {
            type: new mongoose.Schema({
                title: {
                    type: String,
                    required: true,
                    min: 5,
                    max: 50
                },
                dailyRentalRate: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 255
                },
                dateOut: {
                    type: Date,
                    default: Date.now,
                    required: true
                },
                dateReturned: {
                    type: Date
                }
            })
        },
        rentalFee: {
            type: Number,
            min: 0
        }
    })
);

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
