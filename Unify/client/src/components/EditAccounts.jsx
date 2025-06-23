import { useState, useEffect} from 'react'
import accountService from '../services/accountService.jsx'

const displayAccounts = () => {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await accountService.showAllAccounts();
        setResponse(res.data.rows); 
        console.log("response insideUseEffect: ", response)
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h4>Username : Password</h4>
        {response.map((row, index) => {
          return (
            <div key='index'>
              {row.accountid} : {row.accountpassword}
            </div>
          )
        })}
    </div>
  );
}

export const EditAccountForm = ({ onClose }) => {
  const [accountName, setAccountName] = useState("")
  const [accountPw, setAccountPw] = useState("")

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid black' }}>Edit Accounts</h2>

      <div style={{ marginTop: '12px' }}>
        <label>Account Name</label>
        <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>Account Password</label>
        <input type="text" value={accountPw} onChange={e => setAccountPw(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button style={addBtnStyle}>Add</button>
        <button style={deleteBtnStyle}>Delete</button>
        <button style={deleteBtnStyle} onClick = {onClose}>Close form</button>
      </div>
      <div>{displayAccounts()}</div>
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