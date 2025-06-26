import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import '../styles/register.css'
import '../classes/index.jsx'

// Components
import { SimpleBlock } from '../components/simpleBlock.jsx'

function RegisterPage() {
    const navigate = useNavigate()
    const [yourName, setYourName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [action, setAction] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (submitAction) => {
        submitAction.preventDefault()
        if (action === 'register') {
            if (password === confirmPassword){
            const status = await fetch("http://localhost:8888/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    yourName,
                    username,
                    password,
                })
            })
            const data = await status.json()

            if (data.status === true) {
                navigate('/')
            }
            else {
                setError(data.error)
            }
        }
    else{
        setError("Passwords do not match!")
    }
    }
     }




    return (
        <div>
            <h1>
                Register for Unify
            </h1>
            <SimpleBlock
                maxWidth="700px"
                margin="60px auto"
                padding="32px"
                background="#ffffff"
                border="2px solid #007bff"
                boxShadow="0 4px 16px rgba(0,0,0,0.2)"
            >

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5em',
                            cursor: 'pointer',
                            padding: '0 0.5em',
                        }}
                    >
                        &lt;
                    </button>
                </div>
                    {error && <h5 style={{ color: 'red' }}>{error}</h5>}
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='yourName'>
                                Full Name: &nbsp;&nbsp;
                            </label>
                            <input
                                type='text'
                                placeholder='Full Name'
                                id='yourName'
                                value={yourName}
                                onChange={(change) => setYourName(change.target.value)}>
                            </input>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='username'>
                                Username: &nbsp;
                            </label>
                            <input
                                type='text'
                                placeholder='Username'
                                id='username'
                                value={username}
                                onChange={(change) => setUsername(change.target.value)}>
                            </input>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='password'>
                                Password: &nbsp;&nbsp;
                            </label>
                            <input
                                type='password'
                                placeholder='Password'
                                id='password'
                                value={password}
                                onChange={(change) => setPassword(change.target.value)}>
                            </input>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='confirmPassword'>
                                Confirm Password: &nbsp;&nbsp;&nbsp;
                            </label>
                            <input
                                type='password'
                                placeholder='Confirm Password'
                                id='confirmPassword'
                                value={confirmPassword}
                                onChange={(change) => setConfirmPassword(change.target.value)}>
                            </input>
                            <br></br>
                            <button type='register' onClick={() => setAction('register')}>
                                Register
                            </button>

                        </div>

                    </form>

            </SimpleBlock>
        </div>
    )

}

export default RegisterPage