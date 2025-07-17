import { useState } from 'react';
import accountService from '../../services/accountService.jsx';

export const AccountDeletionForm = ({ currentUsername, onDeleteSuccess }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDelete = async (event) => {
  event.preventDefault();

  if (!username || !password) {
    setErrMsg('Please enter both username and password.');
    setSuccessMsg('');
    return;
  }

  try {
    const res = await accountService.deleteAccount({ username, password });
    console.log('Full response:', res);

    if (res.data && res.data.status && typeof res.data.status === 'string') {
      if (res.data.status.toLowerCase().includes('deleted')) {
        setSuccessMsg(res.data.status);
        setErrMsg('');
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        setErrMsg(res.data.status);
        setSuccessMsg('');
      }
    } else {
      setErrMsg('Unexpected response from server.');
      setSuccessMsg('');
    }
  } catch (err) {
    console.error('Error deleting account:', err);
    // If the server sends error message inside err.response.data, show it:
    if (err.response && err.response.data && err.response.data.message) {
      setErrMsg(err.response.data.message);
    } else {
      setErrMsg('Error deleting account');
    }
    setSuccessMsg('');
  }
};

  return (
    <form onSubmit={handleDelete} style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #ccc' }}>
      <h4>Delete Account</h4>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
      /> 

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
      />

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Delete Account
      </button>

      {errMsg && <p style={{ color: 'red', marginTop: '8px' }}>{errMsg}</p>}
      {successMsg && <p style={{ color: 'green', marginTop: '8px' }}>{successMsg}</p>}
    </form>
  );
};
