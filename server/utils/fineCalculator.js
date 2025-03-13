// Function to calculate the fine for late returns
export const calculateFine = (dueDate) => {
  const finePerHour = 0.1; // Fine rate: 10 cents per hour

  // Get the current date and time
  const today = new Date();

  // Check if the current date is after the due date
  if (today > dueDate) {
    // Calculate the number of hours the book is overdue
    const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));

    // Calculate the total fine
    const fine = lateHours * finePerHour;

    // Return the calculated fine
    return fine;
  }

  // If the book is returned on or before the due date, no fine is charged
  return 0;
};
