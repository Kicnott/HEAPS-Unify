import React from 'react'

export const DropdownList = ({optionArray, onChange, defaultValue}) => {
  return (
    <div>
      <select selected={defaultValue} onChange={onChange}>
        {optionArray.map(option=> (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
