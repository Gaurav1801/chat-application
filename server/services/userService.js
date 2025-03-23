const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET_KEY = "your_secret_key"; // Change this to an environment variable

module.exports = {
    registerUser: async({ name, email, password }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        await user.save();
        return user;
    },
    loginUser: async({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign({ userId: user._id, email: email, password: user.password },
            SECRET_KEY, { expiresIn: "1h" }
        );
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        };
        return userData;
    },
    getAllUsers: async() => {
        try {
            const users = await User.find({})
                // console.log("users", users)
            return users
        } catch (error) {
            return error
        }
    }
};