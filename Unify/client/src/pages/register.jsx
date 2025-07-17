import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import '../styles/register.css'
import { Link } from 'react-router-dom'
import '../classes/index.jsx'

// Components
import { SimpleBlock } from '../components/blocks/SimpleBlock.jsx'

function RegisterPage() {
    const navigate = useNavigate()
    const [yourName, setYourName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [accountDescription, setAccountDescription] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [action, setAction] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (submitAction) => {
        submitAction.preventDefault()
        if (action === 'register') {
            if (password === confirmPassword){
            const status = await fetch("https://heaps-unify-1.onrender.com/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    yourName,
                    username,
                    password,
                    accountDescription
                })
            })
            const data = await status.json()

            if (data.status === true) {
                navigate('/', {state: {message: "Registration successful!"}})
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
                Create an Account
            </h1>
            <SimpleBlock
                maxWidth="700px"
                margin="20px auto"
                padding="20px"
                background="#ffffff"
                border="none"
                boxShadow="none"
            >

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
                          </div>
                        <div className='form-group'>
                            <label htmlFor='accountDescription'>
                                Account Description: &nbsp;&nbsp;&nbsp;
                            </label>
                            <input
                                type='textbox'
                                placeholder='Account Description...'
                                id='accountDescription'
                                value={accountDescription}
                                onChange={(change) => setAccountDescription(change.target.value)}>
                            </input>
                          </div>
                            <br></br>
                            <button type='register' onClick={() => setAction('register')}
                                style={{
                                backgroundColor: ' #A78E72', 
                                color: 'white', 
                                width: '90%', 
                                height: '60px', 
                                borderRadius:'10px', 
                                margin: 'auto',
                                fontSize: '1.1rem' }}>
                                Register
                            </button>

                            <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                            Already have an account?{'  '}
                            <Link to="/" style={{ color: ' #A78E72' , textDecoration: 'underline'}}>
                            Login
                            </Link>
                            </p>

                    </form>
                    

            </SimpleBlock>
        </div>
    )

}

export default RegisterPage