import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

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

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 max-w-full overflow-hidden">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Registered Users
          </h2>
        </header>

        {/* Table Container */}
        {users && users.filter((u) => u.role === "User").length > 0 ? (
          <div className="mt-6 bg-white rounded-md shadow-lg max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-center whitespace-nowrap ">
                      No. of Books Borrowed
                    </th>
                    <th className="px-4 py-2 text-center whitespace-nowrap">
                      Registered
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users
                    .filter((u) => u.role === "User")
                    .map((user, index) => (
                      <tr
                        key={user._id}
                        className={index % 2 === 0 ? "bg-gray-50" : ""}
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {user.role}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          {user?.borrowedBooks?.length || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h3 className="text-xl md:text-2xl mt-5 font-medium text-gray-600">
            No registered users found in library.
          </h3>
        )}
      </main>
    </>
  );
};

export default Users;
