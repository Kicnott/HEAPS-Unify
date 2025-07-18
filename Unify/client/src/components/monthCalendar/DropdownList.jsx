import React from 'react'
import '../../styles/DropdownList.css';

export const DropdownList = ({ optionArray, onChange, value }) => {
  // optionArray: The array of option objects that will be stored in <option> nested in <select>
  // - Format is:
  // let optionArray = [
  // {value: '1', label: 'Option 1'},
  // {value: '2', label: 'Option 2'},
  // ...
  // ]
  // - value is the variable to be stored and used for processing
  // - label is the string to be displayed in the list for the option
  // onChange: A function to be run whenever the selected option is changed. E.g. updating the calendar displayed.
  // value: The default value that will be selected at the start.
  return (
    <div className="dropdown-container">
      <select value={value} onChange={onChange}>
        {optionArray.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    // Mapping optionArray to different <option> elements
    // option => (...) basically means for each element in the array, temporarily storing it in the option variable (Like 'for option in optionArray' in Python)
  )
}