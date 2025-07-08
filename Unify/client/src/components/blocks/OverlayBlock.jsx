export const OverlayBlock = ({ children, isHidden, onClose }) => {
  const blockStyle = {
    width: '500px',
    height: '500px',
    padding: '24px',
    background: 'white',
    border: '3px solid #A78E72',
    borderRadius: '3px',
    textAlign: 'center',
    position: 'fixed',
    display: isHidden ? 'none' : 'block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'auto',
    zIndex: 1001
  }

  const closeBtnStyle = {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'transparent',
    border: 'none',
    outline: 'none',  
    fontSize: 20,
    cursor: 'pointer',
    zIndex: 1002
  }

  return (
    <div style={{ ...blockStyle, position: 'fixed' }}>
      {onClose && (
        <button onClick={onClose} style={closeBtnStyle}>×</button>
      )}
      <div style={{ height: '100%', width: '100%' }}>
        {children}
      </div>
    </div>
  )
}