import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import '../classes/index.jsx'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

// Components
import { SimpleBlock } from '../components/simpleBlock.jsx'

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
            const response = await fetch("http://localhost:8888/login", {
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
            <h1>
                Sign in to Unify
            </h1>
            <p>
                <SimpleBlock>
                    <form onSubmit={handleSubmit}> {/* Assigns the functionality for the submit button*/}
                        <p style={{ fontSize: '1.1rem'}}>
                            <label htmlFor='username'>
                                Username:&nbsp;&nbsp;&nbsp;
                            </label>
                            <input type='text' placeholder='Username' id='username'
                                value={username} // Assigns the username state to the value of the <input>, so that the <input> will update as username is modified
                                onChange={(change) => setUsername(change.target.value)} // Whenever the value of the <input> is modified, username state is updated accordingly
                            >
                            </input>
                            <br></br>
                            <label htmlFor='password'>
                                Password:&nbsp;&nbsp;&nbsp;
                            </label>
                            <input type='password' placeholder='Password' id='password'
                                value={password} // Assigns the password state to the value of the <input>, so that the <input> will update as password is modified
                                onChange={(change) => setPassword(change.target.value)} // Whenever the value of the <input> is modified, password state is updated accordingly
                            >
                            </input>
                            <br></br>
                            <br></br>
                            <button type='login' onClick={() => setAction("login")}
                                style={{ backgroundColor: ' #A78E72', 
                                color: 'white', 
                                width: '90%', 
                                height: '60px', 
                                borderRadius:'10px', 
                                margin: 'auto',
                                fontSize: '1.1rem'}}
>
                                Login
                            </button>

                            <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                            Need an account?{'  '}
                            <Link to="/register" style={{ color: ' #A78E72' , textDecoration: 'underline'}}>
                            Register
                            </Link>
                            </p>


                        </p>
                    </form>
                    <h5 style={{ color: 'tomato' }}>{errorMessage}</h5> {/*Displays errorMessage*/}
                    <h5 style={{ color: 'green' }}>{message}</h5>
                </SimpleBlock>
            </p>
        </div>
    )
}
export default LoginPage // Means that login.jsx only exports LoginPage