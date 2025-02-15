const userService = require("../services/userService");
module.exports = {
  registerUser: async (req, res) => {
    try {
      const user = await userService.registerUser(req.body);
      res.status(201).json({
        succes: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({ succes: false, error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const data = await userService.loginUser(req.body);
      res
        .status(200)
        .json({ succes: true, message: "Login successful", data });
    } catch (error) {
      res.status(401).json({ succes: false, error: error.message });
    }
  },
};
