import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import '../classes/index.jsx'

// Components
import { SimpleBlock } from '../components/simpleBlock.jsx'

function LoginPage() {

    // useState creates variables that are saved even when the page re-renders
    // [variable, function to change variable] is the format
    const navigate = useNavigate() // Assigns the function to navigate to different routes. Idk why useNavigate() raw does not work
    const [username, setUsername] = useState('') // Assigns a string state for username
    const [password, setPassword] = useState('') // Assigns a string state for password
    const [errorMessage, setErrorMessage] = useState(''); // String state for errorMessage

    const handleSubmit = async (submitAction) => {
        submitAction.preventDefault() // Prevents the form from being submitted through GET or POST normally
        // TODO, send data to server, authentication, all that jazz
        const status = await fetch("http://localhost:8888/login", {
            method: 'POST',
              headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
            })
        })

        const data = await status.json();

        if (data.status===true){
            sessionStorage.setItem("currentUser", username)
            navigate('/home')
        } else {
            console.log("Log in failed.")
            setErrorMessage("Log in failed."); // Displays error message when user fails to log in
        }
    }
    return (
        <div>
            <h1>
                Sign in to Unify
            </h1>
            <h2>
                <SimpleBlock>
                    <form onSubmit={handleSubmit}> {/* Assigns the functionality for the submit button*/}
                        <h4>
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
                            <input type='submit' name='login' value="Login">
                            </input>
                        </h4>
                    </form>
                    <h5 style ={{color: 'red'}}>{errorMessage}</h5> {/*Displays errorMessage*/}
                </SimpleBlock>
            </h2>
        </div>
    )
}
export default LoginPage // Means that login.jsx only exports LoginPage