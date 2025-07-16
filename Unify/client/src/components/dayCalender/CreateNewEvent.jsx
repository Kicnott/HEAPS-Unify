import React, { useEffect, useState } from 'react'
import eventService from '../../services/eventService.jsx'
import { getMyCalendars } from '../LeftPanel/LeftPanelFunctions.jsx'
import { DateTime } from 'luxon'

export const CreateEvent = ({ onClose, chosenDate, onSave, accountid, calendarid }) => {

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [repeat, setRepeat] = useState("none")
  const [repeatEndDate, setRepeatEndDate] = useState("")
  const [errors, setErrors] = useState([])
  const [calendarID, setCalendarID] = useState(calendarid || "")
  const [myCalendars, setMyCalendars] = useState([])
  const [eventStartDate, setEventStartDate] = useState(formatDateForInput(new Date()))
  const [eventEndDate, setEventEndDate] = useState(formatDateForInput(new Date()))

  useEffect(() => {
    getMyCalendars(accountid).then(setMyCalendars);
  }, [accountid])

  useEffect(() => {
    if (chosenDate) {
      setEventStartDate(formatDateForInput(chosenDate))
      setEventEndDate(formatDateForInput(chosenDate))
    }
  }, [chosenDate])
  // console.log("myCalendars State:", myCalendars)

  const handleSave = async (e) => {
    setErrors([]);

    const startDateTime = new Date(`${eventStartDate}T${startTime}`);
    const endDateTime = new Date(`${eventEndDate}T${endTime}`);


    const errors = [];
    if (!name) errors.push("Event name is required");
    if (!description) errors.push("Description is required");
    if (!location) errors.push("Location is required");
    if (!startTime) errors.push("Start Time is required");
    if (!endTime) errors.push("End Time is required");
    if (!calendarID) errors.push("Calendar is required");

    if (startTime && endTime) {
      const durationMs = endDateTime - startDateTime;
      const minDurationMs = 15 * 60 * 1000;

      if (endTime === "00:00") {
        errors.push("End Time cannot be 12:00am. Please select up to 11:45pm.");
      }
      if (startDateTime.getTime() === endDateTime.getTime()) {
        errors.push("Events must be at least 15 minutes long");
      }
      if (startDateTime >= endDateTime) {
        errors.push("End Time must be after Start Time");
      }
      if (durationMs < minDurationMs && startDateTime < endDateTime) {
        errors.push("Events must be at least 15 minutes long");
      }
    }


    if (errors.length > 0) {
      setErrors(errors);
      return;
    }


    try {
      const res = await eventService.createEvent({
        name,
        description,
        location,
        startdt: startDateTime.toISOString(),  // UTC format
        enddt: endDateTime.toISOString(),      // UTC format  
        calendarID,
        repeat,
        repeatUntil: repeatEndDate
      })

      setName("");
      setDescription("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setRepeat("")
      setCalendarID("")
      setErrors([]);

      console.log('Event insertion status:', res.data.status)
      if (onSave) onSave();
    } catch (err) {
      console.error("Error creating event", err);
      setErrors(["Failed to create event. Please try again."]);
    }
  }

  // round minute options to 15 minutes intervals
  const round15Minute = setter => e => {
    const value = e.target.value;
    // value is in "HH:MM" format
    const [hour, minute] = value.split(':').map(Number);
    if ([0, 15, 30, 45].includes(minute)) {
      setter(value);
    } else {
      // Optionally, round to nearest 15 or reject
      const roundedMinute = Math.round(minute / 15) * 15;
      const newValue = `${String(hour).padStart(2, '0')}:${String(roundedMinute % 60).padStart(2, '0')}`;
      setter(newValue);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <h2>
        New Event
      </h2>
      <hr></hr>

      <div style={{ marginTop: '12px' }}>
        <label>Event Name</label>
        <input type='text' value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Description</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Location</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Start Time</label>
        <input type="date" value={eventStartDate} onChange={e => setEventStartDate(e.target.value)} style={inputStyle} />
        <input type="time" step="900" value={startTime} onChange={round15Minute(setStartTime)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>End Time</label>

        <input
          type="date"
          value={eventEndDate}
          min={DateTime.fromJSDate(chosenDate).toFormat('yyyy-MM-dd')}
          onChange={e => setEventEndDate(e.target.value)}
          style={inputStyle}
        />

        <input type="time" step='900' value={endTime} onChange={round15Minute(setEndTime)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Repeat</label>
        <select value={repeat} onChange={e => setRepeat(e.target.value)} style={inputStyle}>
          <option value='none'>None</option>
          <option value='daily'>Every day</option>
          <option value='weekly'>Every week</option>
          <option value='monthly'>Every month</option>
          <option value='yearly'>Every year</option>
        </select>
      </div>

      {repeat != 'none' && (
        <div style={{ marginTop: '12px' }}>
          <label>Repeat until</label>
          <input
            type="date"
            value={repeatEndDate}
            min={DateTime.fromJSDate(chosenDate).toFormat('yyyy-MM-dd')}
            onChange={e => setRepeatEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <label>Calendar</label>
        <select value={calendarID} onChange={e => setCalendarID(e.target.value)} style={inputStyle}>
          <option value="">Select a calendar</option>
          {myCalendars.map(calendar => (
            <option key={calendar.calendarid} value={calendar.calendarid}>
              {calendar.calendarname}
            </option>
          ))}
        </select>
      </div>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

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