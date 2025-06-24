import React, { useState } from 'react'

export const CreateEvent = ({ onClose, onSave }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [repeat, setRepeat] = useState("None")

  const handleSave = () => {
    const eventData = {
      name,
      description,
      location,
      startTime,
      endTime,
      repeat
    }
    if (onSave) onSave(eventData)
    onClose()
  }

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Event Name</h2>

      <div style={{ marginTop: '12px' }}>
        <label>Description</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>📍 Location</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Start Time</label>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>End Time</label>
        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Repeat</label>
        <select value={repeat} onChange={e => setRepeat(e.target.value)} style={inputStyle}>
          <option>None</option>
          <option>Every day</option>
          <option>Every week</option>
          <option>Every month</option>
        </select>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={discardBtnStyle} onClick={onClose}>Discard</button>
        <button style={saveBtnStyle} onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  border: '2px solid black',
  borderRadius: '4px',
  fontSize: '14px',
  marginTop: '4px'
}

const discardBtnStyle = {
  background: 'white',
  color: 'red',
  border: '2px solid red',
  borderRadius: '20px',
  padding: '6px 12px',
  cursor: 'pointer'
}

const saveBtnStyle = {
  background: 'white',
  border: '2px solid black',
  borderRadius: '20px',
  padding: '6px 12px',
  cursor: 'pointer'
}