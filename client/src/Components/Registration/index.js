import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { registerUser } from "../../service/auth";
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const navigate= useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await registerUser(values);
        console.log("Registration Successful:", response);
        if(response.succes){
            alert("Registration Successful");
            navigate('/')
        }
      } catch (error) {
        console.error("Registration Failed:", error);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 p-6 shadow-2xl rounded-2xl bg-white">
          <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
            <input 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formik.values.name} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
            />
            {formik.touched.name && formik.errors.name && <span className="text-red-500 text-sm">{formik.errors.name}</span>}
            
            <input 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              type="text" 
              name="email" 
              placeholder="Email" 
              value={formik.values.email} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
            />
            {formik.touched.email && formik.errors.email && <span className="text-red-500 text-sm">{formik.errors.email}</span>}
            
            <input 
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formik.values.password} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
            />
            {formik.touched.password && formik.errors.password && <span className="text-red-500 text-sm">{formik.errors.password}</span>}
            
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
            >
              Register
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
