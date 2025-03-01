import axios from "axios";

const API_URL = "http://localhost:5000/api/users";




const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-users`, );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};



export {getAllUsers };
