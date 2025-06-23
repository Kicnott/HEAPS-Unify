import express from 'express' // Express.js
import cors from 'cors' // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat
import pool from './db.js' // Defines the connection pool for the database

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data, which is (probably??) what we will use

app.get('/', (req, res) => {
  res.send('Hey ho server is up')
}) // For testing. Run the server and go to localhost:8888 to see message

//Display Accounts
app.get('/home/showAllAccounts', async (req, res) => {
  try {
    console.log("GetAllAccounts: Connected!")

    const result = await pool.query( // searches for all accounts in the database
      'SELECT * FROM AccountsTable'
    );
    
    return res.json(result)
  } catch (e){
    console.log("GetAllAccounts: Server Error")
    return res.json(e)
  }
})

//Create Accounts
app.post('/home/createAccount', async (req, res) => {
  try {
    console.log("createAccount: Connected!")

    const inputUsername = req.body.username
    const inputPassword = req.body.password

    if (inputUsername == '' || inputPassword == ''){
      return res.json({ status : "Input Something!"})
    }
    const usernamePasswordMatch = await pool.query( 
      'SELECT accountid FROM AccountsTable where accountusername = ($1) and accountpassword = ($2)', [inputUsername, inputPassword]
    );

    if (usernamePasswordMatch.rows.length > 0){
      return res.json({ status : "Account already exists"})
    }

    const latestResult = await pool.query( // searches for all accounts in the database
      'SELECT accountid FROM AccountsTable ORDER BY accountid::int DESC LIMIT 1'
    );

    const latestId = latestResult.rows.length > 0 ? parseInt(latestResult.rows[0].accountid) : 0;
    const newId = latestId + 1;

    const result = await pool.query( // searches for all accounts in the database
      'INSERT INTO AccountsTable (accountid,accountusername,accountpassword) VALUES ($1, $2, $3)', [newId, req.body.username, req.body.password]
    );
    
    return res.json({ status: 'Account created' })
  } catch (e){
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create account' })
  }
})

// Login authentification
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query( // searches for user in the database
      'SELECT * FROM username_data WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (user && user.password === password) {
      console.log("Data matches!");
      res.json({ status: true }); // Return true if username and password matches database
    } else {
      console.log("Data does not match");
      res.json({ status: false }); // Return false if username and password does not match database
    }
})

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}) // Check that the database is connected; Go to http://localhost:8888/api/test-db

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello the server is working' })
  console.log('A request hath been made')
}) // Tests connection with front-end; Go to test-server page


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) // Starts the server and sends the message when there are any requests from port 8888