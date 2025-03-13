import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
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
import { useSelector } from "react-redux";
import Header from "../layout/Header";

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

const UserDashboard = () => {
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let borrowedBooks = userBorrowedBooks.filter((book) => !book.returned);
    let returnedBooks = userBorrowedBooks.filter((book) => book.returned);
    setTotalBorrowedBooks(borrowedBooks.length);
    setTotalReturnedBooks(returnedBooks.length);
  }, [userBorrowedBooks]);

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
    <main className="relative flex-1 p-6 pt-28">
      <Header />
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
        {/* Left Side */}
        <div className="flex flex-col flex-[4] gap-7 xl:min-h-[85vh]">
          {/* Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[
              { icon: bookIcon, text: "Your Borrowed Book List" },
              { icon: returnIcon, text: "Your Return Book List" },
              { icon: browseIcon, text: "Let's browse books inventory" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-5 min-h-[140px] rounded-lg transition hover:shadow-lg"
              >
                <span className="w-[3px] bg-black h-full"></span>
                <span className="bg-gray-300 h-20 min-w-20 flex justify-center items-center rounded-lg">
                  <img src={item.icon} alt="icon" className="w-8 h-8" />
                </span>
                <p className="text-lg xl:text-xl font-semibold">{item.text}</p>
              </div>
            ))}
          </div>
          {/* Motivational Quote Section */}
          <div className="relative bg-white p-7 text-lg sm:text-xl xl:text-2xl min-h-52 font-semibold flex justify-center items-center rounded-2xl shadow-md">
            <h4>"Read more, learn more, achieve more."</h4>
            <p className="text-gray-700 text-sm sm:text-lg absolute right-8 bottom-3">
              ~ BookWorm Team
            </p>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex flex-col flex-[2] gap-10 xl:gap-16 items-center">
          {/* Pie Chart */}
          <div className="w-full max-w-[350px] ">
            <Pie
              data={data}
              options={{ cutout: 0 }}
              className="mx-auto lg:mx-0 w-full h-auto"
            />
          </div>
          {/* Stats Card */}
          <div className="flex items-center p-6 w-full max-w-[350px] bg-white rounded-lg shadow-md">
            <img src={logo} alt="logo" className="w-auto h-12" />
            <span className="w-[2px] bg-black h-12  mx-4"></span>
            <div className="flex flex-col gap-4">
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
      </div>
    </main>
  );
};

export default UserDashboard;
