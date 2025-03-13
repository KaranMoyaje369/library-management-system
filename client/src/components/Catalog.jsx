import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `
    ${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };
  const currentDate = new Date();
  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  const overDueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overDueBooks;

  const [email, setEmail] = useState("");

  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 max-w-full overflow-hidden">
        <Header />

        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg  sm:rounded-bl-lg text-center  font-semibold py-3 w-full sm:w-72 ${
              filter === "borrowed"
                ? "bg-black text-white "
                : "bg-gray-200 text-black  hover:bg-gray-300"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg  sm:rounded-br-lg text-center  font-semibold py-3 w-full sm:w-72 ${
              filter === "overdue"
                ? "bg-black text-white "
                : "bg-gray-200 text-black  hover:bg-gray-300"
            }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Username
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Price
                    </th>

                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Return
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {booksToDisplay.map((book, index) => (
                    <tr
                      key={book._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {book?.user.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {book?.user.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {book.price}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatDateAndTime(book.createdAt)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {book.returnDate ? (
                          <FaSquareCheck className="w-6 h-6" />
                        ) : (
                          <PiKeyReturnBold
                            onClick={() =>
                              openReturnBookPopup(book.book, book?.user.email)
                            }
                            className="w-6 h-6"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found!
          </h3>
        )}
      </main>
      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </>
  );
};

export default Catalog;
