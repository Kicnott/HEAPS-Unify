import React from 'react'

export const DropdownList = ({optionArray, onChange, defaultValue}) => {
  return (
    <div>
      <select value={defaultValue} onChange={onChange}>
        {optionArray.map(option=> (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
