import React, { useEffect, useState } from 'react';
import accountService from '../../services/accountService.jsx';
import placeholderPic from '../../assets/placeholder_pfp.jpg';

function formatFollowerCount(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

export const RightDrawer = ({
  children,
  rightDrawerOpen,
  onClose,
  profilePic,
  currentUsername,
  accountid
}) => {
  const [confirmUsername, setConfirmUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    if (accountid) {
      accountService.getAccount(accountid)
        .then(res => {
          console.log("Fetched account data:", res.data);
          setAccountData(res.data);
        })
        .catch(() => setError("Failed to load account data."));
    }
  }, [accountid]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: rightDrawerOpen ? 0 : '-400px',
        width: '400px',
        height: '500px',
        background: 'white',
        boxShadow: '0 0 10px rgba(26, 19, 19, 0.2)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        padding: '40px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            padding: '2px 6px',
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            outline: 'none',
          }}
        >
          ×
        </button>
      )}

      {/* Profile Picture */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <img
          src={accountData?.profilePicUrl || profilePic || placeholderPic}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #333',
          }}
        />
      </div>

      {/* Username */}
      {accountData && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <strong style={{ fontSize: 22 }}>{accountData.accountusername}</strong>
        </div>
      )}

      {/* Follower Count */}
      {accountData && (
        <div style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: '500',
          marginBottom: '20px',
          color: '#333',
        }}>
          👥 {formatFollowerCount(accountData.followercount)} follower{accountData.followercount === 1 ? '' : 's'}
        </div>
      )}

      {/* Other content passed into drawer */}
      {children}
    </div>
  );
};
