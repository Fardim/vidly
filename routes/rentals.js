const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
        return res.status(404).send("The rental with the ID was not found");
    }
    res.send(rental);
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    // if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
    //     return res.status(400).send("Invalid customer id");
    // if (!mongoose.Types.ObjectId.isValid(req.body.movieId))
    //     return res.status(400).send("Invalid movie id");
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");
    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();

    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                { $inc: { numberInStock: -1 } }
            )
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send("something faild");
    }
});

module.exports = router;
