import { useState, useEffect} from 'react'
import accountService from '../services/accountService.jsx'

export const EditAccountForm = ({ onClose }) => {
  const [inputUsername, setinputUsername] = useState("") // state for inputted username box
  const [inputPassword, setinputPassword] = useState("") // state for inputted password box
  const [ErrMsg, setErrMsg] = useState("") // Error Message to be displayed, error outcomes received from server
  const [refreshDisplayTrigger, setRefreshDisplayTrigger] = useState(1) // After create/delete, refreshes displayed Accounts


  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Edit Accounts</h2>

      <div style={{ marginTop: '12px' }}>
        <label>Account Name</label> 
        <input type="text" value={inputUsername} onChange={e => setinputUsername(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Account Password</label>
        <input type="text" value={inputPassword} onChange={e => setinputPassword(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={addBtnStyle} onClick={createAccount(inputUsername, inputPassword, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger)}>Add</button>
        <button style={deleteBtnStyle} onClick={deleteAccount(inputUsername, inputPassword, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger)}>Delete</button>
        <button style={deleteBtnStyle} onClick = {onClose}>Close form</button>
      </div>
      <DisplayAccounts ErrMsg = {ErrMsg} refreshDisplayTrigger={refreshDisplayTrigger}></DisplayAccounts>
    </div>
  )
}

//Display all active accounts inside form
const DisplayAccounts = ({ErrMsg, refreshDisplayTrigger}) => {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await accountService.showAllAccounts();
        const sorted = res.data.rows.sort((a, b) => a.accountid - b.accountid);
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
      <h4>ID : Username : Password</h4>
        {response.map((row, index) => {
          return (
            <div key={index}>
              {row.accountid} : {row.accountusername} : {row.accountpassword}
            </div>
          )
        })}
    </div>
  );
}

//Create a new account and add it to the database
const createAccount = (inputUsername, inputPassword, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger) => async (event) => {
  event.preventDefault();

  try {
    const res = await accountService.createAccount({
      username: inputUsername,
      password: inputPassword,
    });
    console.log('Account status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error creating account:', err);
    setErrMsg(JSON.stringify(err));
  }
};

//Create an account in the database
const deleteAccount = (inputUsername, inputPassword, setErrMsg, refreshDisplayTrigger, setRefreshDisplayTrigger) => async (event) => {
  event.preventDefault();

  try {
    const res = await accountService.deleteAccount({
      username: inputUsername,
      password: inputPassword,
    });
    console.log('Account status:', res.data.status);
    setErrMsg(res.data.status);
    setRefreshDisplayTrigger(refreshDisplayTrigger + 1)
  } catch (err) {
    console.error('Error deleting account:', err);
    setErrMsg(JSON.stringify(err));
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

const deleteBtnStyle = {
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