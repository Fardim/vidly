const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean
    }
});
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin
        },
        config.get("jwtPrivateKey")
    );
};
const User = mongoose.model("user", userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required(),
        password: Joi.string()
            .min(5)
            .max(50)
            .required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
