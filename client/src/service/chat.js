import axios from "axios";

const API_URL = "http://localhost:5000/api/users";




const getAllMessage = async(data) => {
    try {
        const response = await axios.post(`${API_URL}/createChat`, data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const sendMessage = async(data) => {
    try {
        const response = await axios.post(`${API_URL}/sendMessage`, data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};



export { getAllMessage, sendMessage };