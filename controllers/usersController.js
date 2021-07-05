const User = require('../models/User')
const { validationResult } = require("express-validator");
const createError = require("http-errors");


// exports.uploadUserPhoto = upload.single('photo');


exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        .select("-password")
        .sort("lastName")
        .limit(5);
        res.status(200).send(users);
    } catch (e) {
        next(e);
    }
};


exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password -__v");
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).select('-password');
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) throw new createError.NotFound();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};

exports.addUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    } catch (e) {
        next(e);
    }
};
