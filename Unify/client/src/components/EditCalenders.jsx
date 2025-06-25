import { useState, useEffect} from 'react'
import calenderService from '../services/calenderService.jsx'

export const EditCalendersForm = ({ onClose, currentAccountId }) => {
  const [inputCalenderName, setCalenderName] = useState("") 
  const [inputCalenderDescription, setCalenderDescription] = useState("") 
  const [ErrMsg, setErrMsg] = useState("") // Error Message to be displayed, error outcomes received from server
  const [refreshDisplayTrigger, setRefreshDisplayTrigger] = useState(1) // After create/delete, refreshes displayed Accounts


  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Edit Accounts</h2>

      <div style={{ marginTop: '12px' }}>
        <label>Calender Name</label> 
        <input type="text" value={inputCalenderName} onChange={e => setCalenderName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Calender Description</label>
        <input type="text" value={inputCalenderDescription} onChange={e => setCalenderDescription(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={addBtnStyle} onClick={createCalender(inputCalenderName, inputCalenderDescription, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger, currentAccountId)}>Add</button>
        <button style={closeBtnStyle} onClick = {onClose}>Close form</button>
      </div>
      <DisplayCalenders ErrMsg = {ErrMsg} setErrMsg = {setErrMsg} refreshDisplayTrigger={refreshDisplayTrigger} setRefreshDisplayTrigger={setRefreshDisplayTrigger}></DisplayCalenders>
    </div>
  )
}

//Display all active accounts inside form
const DisplayCalenders = ({ErrMsg, setErrMsg, setRefreshDisplayTrigger, refreshDisplayTrigger}) => {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await calenderService.showAllCalenders()
        const sorted = res.data.rows.sort((a, b) => a.mycalenderid - b.mycalenderid);
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
      <h4>Calender ID : My Calender : Description : Account ID</h4>
        {response.map((row, index) => {
            const isRoot = row.mycalenderid === '1'; // isRoot checks Root's calender (ID:1)
          return (
            <div key={index}>
              {row.mycalenderid} : {row.mycalendername} : {row.mycalenderdescription} : {row.accountid} 
              &nbsp; 
              &nbsp;
              { !isRoot ? ( // Outputs a red 'X' that deletes the calender, does not display for root
                <b 
                    style={{cursor: 'pointer', color: 'red'}} 
                    onClick={ (e) => 
                        deleteCalender(
                            row.mycalenderid, 
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
const createCalender = (inputCalenderName, inputCalenderDescription, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger, currentAccountId) => async (event) => {
  event.preventDefault();

  try {
    const res = await calenderService.createCalender({
      calenderName: inputCalenderName,
      calenderDescription: inputCalenderDescription,
      accountid : currentAccountId
    });
    console.log('Calender status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error creating calender:', err);
    setErrMsg('Error creating calender');
  }
};

//Create an account in the database
const deleteCalender = (mycalenderid, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger) => async (event) => {
  event.preventDefault();

  try {
    const res = await calenderService.deleteCalender({
      calenderid: mycalenderid,
    });
    console.log('Calender status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error deleting Calender:', err);
    setErrMsg('Error deleting Calender');
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