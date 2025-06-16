import React from 'react'

export const DropdownList = ({optionArray, onChange, value}) => {
  return (
    <div>
      <select value={value} onChange={onChange}>
        {optionArray.map(option=> (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
