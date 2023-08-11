import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

/**
 * Register user
 */
export const register = async (request, response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
        });
        const savedUser = await newUser.save();
        response.status(201).json(savedUser);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};

/**
 * Login
 */
export const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email: email });
        if (!user)
            return response.status(400).json({ msg: 'User does not exist!' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return response
                .status(400)
                .json({ msg: 'The password is not correct!' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        response.status(200).json({ token, user });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
};
