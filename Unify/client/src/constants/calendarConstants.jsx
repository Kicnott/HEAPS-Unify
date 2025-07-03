export const monthOptionsArray = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" }
] // The options to be stored in the month drop down list.

export const yearOptionsArray = []; // Defining an empty options array for the year drop down list.
for (let i = 1970; i < 2051; i++) {
    yearOptionsArray.push({ value: String(i), label: String(i) })
} // The options to be stored in the year drop down list. It is too long so using a for loop to push the values in from 1970 to 2050.