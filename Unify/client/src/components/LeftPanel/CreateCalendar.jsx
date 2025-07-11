import React, { useState, useEffect } from 'react'
import calendarService from '../../services/calendarService'
import { ColorPopover } from '../blocks/ColorPopover'

export const CreateCalendar = ({ accountid, onClose, onSave }) => {
    const [calendarName, setCalendarName] = useState("")
    const [calendarDescription, setCalendarDescription] = useState("")
    const [calendarPrivacy, setCalendarPrivacy] = useState("public")
    const [calendarColour, setCalendarColour] = useState("#f6d8ac")
    const [errors, setErrors] = useState([])

    function colourChangeComplete(colour, calendarid) {
        setCalendarColour(colour)
    }

    const handleSave = async (e) => {
        setErrors([])

        const saveErrors = []
        if (!calendarName) saveErrors.push("Calendar name is required")
        if (!calendarDescription) saveErrors.push("Calendar Description is required")
        if (!calendarPrivacy) saveErrors.push("Calendar Privacy setting is required")
        if (!calendarColour) saveErrors.push("Calendar Colour is required")

        if (saveErrors.length > 0) {
            setErrors(saveErrors)
            return;
        }

        try {
            const res = await calendarService.createCalendar({
                calendarName: calendarName,
                calendarDescription: calendarDescription,
                accountid: accountid,
                calendarPrivacy: calendarPrivacy,
                calendarColour: calendarColour
            })
            if (onSave) {
                onSave()
            }
        }
        catch (err) {
            console.error("Error creating calendar", err)
            setErrors(["Failed to create calendar. Please try again."])
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <h2>
                New Calendar
            </h2>
            <hr></hr>

            <div style={{ marginTop: '12px' }}>
                <label>
                    <b>Calendar Name:</b>
                    <input type='text' value={calendarName} onChange={e => setCalendarName(e.target.value)} style={inputStyle}></input>
                </label>
            </div>

            <div style={{ marginTop: '12px' }}>
                <label>
                    <b>Calendar Description:</b>
                    <textarea value={calendarDescription} onChange={e => setCalendarDescription(e.target.value)} style={inputStyle}></textarea>
                </label>
            </div>

            <div style={{ marginTop: '12px' }}>
                <label>
                    <b>Calendar Privacy:</b>
                    <select
                        value={calendarPrivacy}
                        onChange={e => setCalendarPrivacy(e.target.value)}
                        style={inputStyle}
                    >
                        <option value={'public'}>Public</option>
                        <option value={'request'}>Request Only</option>
                        <option value={'private'}>Private</option>
                    </select>
                </label>
            </div>

            <div style={{
                marginTop: 16,
                marginBottom: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <label >
                    <b>Calendar Colour:</b>
                </label>
                <ColorPopover
                    color={calendarColour}
                    setColor={setCalendarColour}
                    colorChangeComplete={colourChangeComplete}
                    iconSize={50}
                    iconBorderRadius='6px'
                    style={{
                        boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                        border: '2px solid #e5e7eb',
                        borderRadius: '50%',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        cursor: 'pointer'
                    }}
                    title="Click to change color"
                />
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