import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgetPassword = (e) => {
    e.preventDefault();
    dispatch(forgetPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* Left Side */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[450px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-12 h-44 w-auto"
              />
            </div>
            <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">
              Your premier digital library for borrowing and reading books"
            </h3>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to={"/login"}
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          >
            Back
          </Link>

          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-5">
              Forget Password
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter your Email
            </p>

            <form onSubmit={handleForgetPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition hover:cursor-pointer"
                disabled={loading ? true : false}
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
