import { useState, useEffect} from 'react'
import calendarService from '../../services/calendarService.jsx'

export const EditCalendarsForm = ({ onClose, currentAccountId }) => {
  const [inputCalendarName, setCalendarName] = useState("") 
  const [inputCalendarDescription, setCalendarDescription] = useState("") 
  const [ErrMsg, setErrMsg] = useState("") // Error Message to be displayed, error outcomes received from server
  const [refreshDisplayTrigger, setRefreshDisplayTrigger] = useState(1) // After create/delete, refreshes displayed Accounts


  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Edit Accounts</h2>

      <div style={{ marginTop: '12px' }}>
        <label>Calendar Name</label> 
        <input type="text" value={inputCalendarName} onChange={e => setCalendarName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Calendar Description</label>
        <input type="text" value={inputCalendarDescription} onChange={e => setCalendarDescription(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={addBtnStyle} onClick={createCalendar(inputCalendarName, inputCalendarDescription, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger, currentAccountId)}>Add</button>
        <button style={closeBtnStyle} onClick = {onClose}>Close form</button>
      </div>
      <DisplayCalendars ErrMsg = {ErrMsg} setErrMsg = {setErrMsg} refreshDisplayTrigger={refreshDisplayTrigger} setRefreshDisplayTrigger={setRefreshDisplayTrigger}></DisplayCalendars>
    </div>
  )
}

//Display all active accounts inside form
const DisplayCalendars = ({ErrMsg, setErrMsg, setRefreshDisplayTrigger, refreshDisplayTrigger}) => {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await calendarService.showAllCalendars()
        const sorted = res.data.rows.sort((a, b) => a.calendarid - b.calendarid);
        setResponse(sorted); 
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    }
    fetchData()
  }, [refreshDisplayTrigger])

  return (
    <div>
      <h6 style = {{color: 'red'}}>{ErrMsg}</h6>
      <h4>Calendar ID : My Calendar : Description : Account ID</h4>
        {response.map((row, index) => {
            const isRoot = row.calendarid == '1'; // isRoot checks Root's calendar (ID:1)
          return (
            <div key={index}>
              {row.calendarid} : {row.calendarname} : {row.calendardescription} : {row.accountid} 
              &nbsp; 
              &nbsp;
              { !isRoot ? ( // Outputs a red 'X' that deletes the calendar, does not display for root
                <b 
                    style={{cursor: 'pointer', color: 'red'}} 
                    onClick={ (e) => 
                        deleteCalendar(
                            row.calendarid, 
                            setErrMsg, 
                            refreshDisplayTrigger, 
                            setRefreshDisplayTrigger
                        )(e)}
                        >X</b>) : <></>}
            </div>
          )
        })}
    </div>
  );
}

//Create a new account and add it to the database
const createCalendar = (inputCalendarName, inputCalendarDescription, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger, currentAccountId) => async (event) => {
  event.preventDefault();

  try {
    const res = await calendarService.createCalendar({
      calendarName: inputCalendarName,
      calendarDescription: inputCalendarDescription,
      accountid : currentAccountId
    });
    console.log('Calendar status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error creating calendar:', err);
    setErrMsg('Error creating calendar');
  }
};

//Create an account in the database
const deleteCalendar = (calendarid, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger) => async (event) => {
  event.preventDefault();

  try {
    const res = await calendarService.deleteCalendar({
      calendarid: calendarid,
    });
    console.log('Calendar status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error deleting Calendar:', err);
    setErrMsg('Error deleting Calendar');
  }
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  border: '2px solid black',
  borderRadius: '4px',
  fontSize: '14px',
  marginTop: '4px'
}

const closeBtnStyle = {
  background: 'white',
  color: 'red',
  border: '2px solid red',
  borderRadius: '20px',
  padding: '6px 12px',
  cursor: 'pointer'
}

const addBtnStyle = {
  background: 'white',
  border: '2px solid black',
  borderRadius: '20px',
  padding: '6px 12px',
  cursor: 'pointer'
}