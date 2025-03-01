import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { loginUser } from "../../service/auth";
import { useNavigate } from "react-router-dom";


const Login = () => {
     const navigate= useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")
    }),
    onSubmit: async (values) => {
      try {
        console.log("values",values)
        const response = await loginUser(values);
        console.log("Login Successful:", response);
        if(response.success){
          navigate('/chats')
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Login failed");
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 p-6 shadow-2xl rounded-2xl bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500">Login to your account</p>
          </div>
          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input 
                className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                type="text" 
                name="email" 
                placeholder="Email" 
                value={formik.values.email} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-500 text-sm">{formik.errors.email}</span>
              ) : null}
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input 
                className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formik.values.password} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
              />
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-500 text-sm">{formik.errors.password}</span>
              ) : null}
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
            >
              Login
            </button>
            <p className="text-sm text-center text-gray-500">
              Don't have an account? <a href="#" onClick={()=>{
navigate('/register')
              }} className="text-blue-600">Sign up</a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
