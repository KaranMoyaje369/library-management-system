import React, { useEffect } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import blankProfileImg from "../assets/img.webp";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Header from "../layout/Header";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { books } = useSelector((state) => state.book);
  const { allBorrowedBooks } = useSelector((state) => state.borrow);
  const { settingPopup } = useSelector((state) => state.popup);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(books.length || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfUsers = users.filter((user) => user.role === "User");
    let numberOfAdmin = users.filter((user) => user.role === "Admin");
    setTotalUsers(numberOfUsers.length);
    setTotalAdmin(numberOfAdmin.length);

    let borrowedBooks = allBorrowedBooks.filter((book) => !book.returnDate);
    let returnedBooks = allBorrowedBooks.filter((book) => book.returnDate);
    setTotalBorrowedBooks(borrowedBooks.length);
    setTotalReturnedBooks(returnedBooks.length);
    setTotalBooks(books.length);
  }, [users, allBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        <div className="flex flex-col-reverse xl:flex-row">
          {/* Left Side */}
          <div className="flex-[2] flex-col gap-7 lg:flex-row flex  xl:flex-col items-center justify-around  p-5">
            <div className=" ">
              <Pie
                data={data}
                options={{ cutout: 0 }}
                className="mx-auto lg:mx-0 w-full h-auto"
              />
            </div>

            <div className="p-5 flex items-center justify-center  w-full sm:w-[400px] xl:w-fit  gap-5   bg-white  rounded-lg">
              <img
                src={logo}
                alt="logo"
                className="w-auto xl:flex-1 rounded-lg"
              />

              <span className="w-[2px] bg-black h-full"></span>

              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
                  <span>Total Borrowed Books</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
                  <span>Total Returned Books</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-[4] flex-col gap-7 lg:gap-16 lg:px-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
            <div className="flex flex-[4] flex-col-reverse lg:flex-row gap-7">
              <div className="flex flex-col gap-7 flex-1">
                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={usersIcon} alt="users-icon" className="w-8 h-8" />
                  </span>

                  <span className="w-[2px] bg-black lg:h-full h-20"></span>

                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalUsers}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total User Base
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={bookIcon} alt="book-icon" className="w-8 h-8" />
                  </span>

                  <span className="w-[2px] bg-black lg:h-full h-20"></span>

                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalBooks}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Book Count
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-5 max-h-[120px] overflow-y-hidden rounded-lg transition hover:shadow-inner duration-300 w-full lg:max-w-[360px]">
                  <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                    <img src={adminIcon} alt="admin-icon" className="w-8 h-8" />
                  </span>

                  <span className="w-[2px] bg-black lg:h-full h-20"></span>

                  <div className="flex flex-col items-center gap-2">
                    <h4 className="font-black text-3xl">{totalAdmin}</h4>
                    <p className="font-light text-gray-700 text-sm">
                      Total Admin Count
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row flex-1">
                <div className="flex flex-col lg:flex-row flex-1 items-center justify-center">
                  <div className="bg-white p-5 rounded-lg shadow-lg h-full flex flex-col justify-center items-center gap-4">
                    <img
                      src={(user && user.avatar?.url) || blankProfileImg}
                      className="rounded-full w-32 h-32 object-cover"
                    />
                    <h2 className="text-xl 2xl:text-2xl font-semibold text-center">
                      {user && user.name}
                    </h2>
                    <p className="text-gray-600 text-sm 2xl:text-base text-center">
                      Welcome to your Admin Dashboard. Here you can manage all
                      the settings and monitor the statistics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex bg-white p-7 text-lg sm:text-xl xl:text-3xl 2xl:text-4xl min-h-52 font-semibold relative flex-[3] justify-center items-center rounded-2xl ">
              <h4 className="overflow-y-hidden">
                "Read more, learn more, achieve more."
              </h4>
              <p className="text-gray-700 text-sm sm:text-lg absolute right-8 bottom-3">
                ~ BookWorm Team
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
