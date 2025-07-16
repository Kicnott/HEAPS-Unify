import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import '../classes/index.jsx'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import '../styles/login.css'

// Components
import { SimpleBlock } from '../components/blocks/SimpleBlock.jsx'

function LoginPage() {

    // useState creates variables that are saved even when the page re-renders
    // [variable, function to change variable] is the format
    const navigate = useNavigate() // Assigns the function to navigate to different routes. Idk why useNavigate() raw does not work
    const [username, setUsername] = useState('') // Assigns a string state for username
    const [password, setPassword] = useState('') // Assigns a string state for password
    const [errorMessage, setErrorMessage] = useState(''); // String state for errorMessage
    const [action, setAction] = useState('')
    const location = useLocation()
    const message = location.state?.message

    const handleSubmit = async (submitAction) => {
        submitAction.preventDefault() // Prevents the form from being submitted through GET or POST normally
        // TODO, send data to server, authentication, all that jazz
        if (action === "login") {
            const response = await fetch("https://heaps-unify-1.onrender.com/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            })

            const data = await response.json();

            if (data.status === true) {
                sessionStorage.setItem("currentUser", username)
                console.log(response)
                sessionStorage.setItem("currentUserAccountId", data.userid)
                navigate('/home')
            } else {
                console.log("Log in failed.")
                setErrorMessage("Log in failed."); // Displays error message when user fails to log in
            }
        }
    }


return (
    <div>
        <h1 className='toptext'>Unify</h1>
        <strong style={{fontSize: '0.8rem', color: '#5C4033', fontStyle: 'italic'}}>~The only social calendar you need~</strong>
        <SimpleBlock>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div style={{ fontSize: '1.1rem' }}>
                    <label htmlFor='username'>
                        Username:&nbsp;&nbsp;&nbsp;
                    </label>
                    <input
                        type='text'
                        placeholder='Username'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />

                    <label htmlFor='password'>
                        Password:&nbsp;&nbsp;&nbsp;
                    </label>
                    <input
                        type='password'
                        placeholder='Password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br /><br />

                    <button
                        type='submit'
                        onClick={() => setAction("login")}
                        style={{
                            backgroundColor: '#A78E72',
                            color: 'white',
                            width: '90%',
                            height: '60px',
                            borderRadius: '10px',
                            margin: 'auto',
                            fontSize: '1.1rem'
                        }}
                    >
                        Login
                    </button>

                    <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                        Need an account?{' '}
                        <Link to="/register" style={{ color: '#A78E72', textDecoration: 'underline' }}>
                            Register
                        </Link>
                    </p>
                </div>
            </form>

            {/* Displays error and success messages */}
            <h5 style={{ color: 'tomato' }}>{errorMessage}</h5>
            <h5 style={{ color: 'green' }}>{message}</h5>
        </SimpleBlock>
    </div>
    );
}
export default LoginPage // Means that login.jsx only exports LoginPage