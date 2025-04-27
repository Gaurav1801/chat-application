import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/users`;
console.log("process.env.REACT_APP_API_URL", process.env.REACT_APP_API_URL)
console.log("process.env.REACT_APP_API_URL", API_URL)

const registerUser = async(userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const loginUser = async(userData) => {
    try {
        console.log(`${API_URL}/login`)
        console.log(userData);
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export { registerUser, loginUser };