import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import Header from "../layout/Header";
import { BookA } from "lucide-react";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);

  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
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

  const [filter, setFilter] = useState("returned");

  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === true;
  });

  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === false;
  });

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 max-w-full overflow-hidden">
        <Header />

        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg  sm:rounded-bl-lg text-center  font-semibold py-3 w-full sm:w-72 ${
              filter === "returned"
                ? "bg-black text-white "
                : "bg-gray-200 text-black  hover:bg-gray-300"
            }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg  sm:rounded-br-lg text-center  font-semibold py-3 w-full sm:w-72 ${
              filter === "nonReturned"
                ? "bg-black text-white "
                : "bg-gray-200 text-black  hover:bg-gray-300"
            }`}
            onClick={() => setFilter("nonReturned")}
          >
            Non-Returned Books
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
                      Book Title
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Due Date
                    </th>

                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      Returned
                    </th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">
                      View
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
                        {book.bookTitle}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatDate(book.borrowDate)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {book.returned ? "Yes" : "No"}
                      </td>

                      <td className="px-4 py-2 flex space-x-2 my-3 justify-center whitespace-nowrap">
                        <BookA onClick={() => openReadPopup(book.bookId)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : filter === "returned" ? (
          <h3 className="text-3xl mt-5 font-medium">
            No returned books found!
          </h3>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No non-returned books found!
          </h3>
        )}
      </main>
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
