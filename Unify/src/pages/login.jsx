import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import '../classes/index.jsx'

// Components
import { Navbar } from "../components/navbar.jsx"
import { Button } from "../components/button.jsx"
import { RightDrawer } from "../components/rightDrawer.jsx"
import { MainCalendar } from '../components/mainCalendar.jsx'
import { SimpleBlock } from '../components/simpleBlock.jsx'

function LoginPage() {

    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async(submitAction) => {
        submitAction.preventDefault()
        // TODO, send data to server, authentication, all that jazz
        navigate('/home')
    }
    return (
        <div>
            <h1>
                Sign in to Unify
            </h1>
            <h2>
                <SimpleBlock>
                    <form onSubmit={handleSubmit}>
                        <h4>
                            <label for='username'>
                                Username:&nbsp;&nbsp;&nbsp;
                            </label>
                            <input type='text' placeholder='Username' id='username' value={username} onChange={(change) => setUsername(change.target.value)}></input>
                            <br></br>
                            <label for='password'>
                                Password:&nbsp;&nbsp;&nbsp;
                            </label>
                            <input type='password' placeholder='Password' id='password' value={password} onChange={(change) => setPassword(change.target.value)}></input>
                            <br></br>
                            <input type='submit' name='login' value="Login"></input>
                        </h4>
                    </form>
                </SimpleBlock>
            </h2>
        </div>
    )
}
export default LoginPage