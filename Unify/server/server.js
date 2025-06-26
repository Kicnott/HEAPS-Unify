import express from 'express' // Express.js
import cors from 'cors' // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat
import pool from './db.js' // Defines the connection pool for the database
import session from 'express-session'

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data, which is (probably??) what we will use

app.use(session({
  secret: 'HeapUnify',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
})) // Made using AI to initialise sessions

app.get('/', (req, res) => {
  res.send('Hey ho server is up')
}) // For testing. Run the server and go to localhost:8888 to see message

app.post("/login", async (req, res) => { // Login authentification
  const { username, password } = req.body;

  console.log(req.body);

  const result = await pool.query( // searches for user in the database
    'SELECT * FROM username_data WHERE username = $1',
    [username]
  )

  const user = result.rows[0];

  if (user && user.password === password) {
    console.log("Data matches!");
    req.session.username = req.body.username
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







// JR's REGISTRATION STUFF


app.post("/register", async (req, res) => {
  const { yourName, username, password } = req.body;

  console.log(req.body);

  try {
    const userCheck = await pool.query(
      'SELECT * FROM username_data WHERE username = $1',
      [username]
    );

    if (userCheck.rowCount !== 0) {
      return res.json({ status: false, error: "Username has already been taken!" });
    }

    if (userCheck.rowCount != 0) {
      res.json({ status: false, error: "Username has already been taken!" })
    }
    else {
      const insertion = await pool.query(
        'INSERT INTO username_data (username, password) VALUES ($1, $2)',
        [username, password]
      )
      if (insertion.rowCount != 1) {
        res.json({ status: false, error: "Database insertion failed" })
      }
      else {
        res.json({ status: true, name: yourName })
      }
    }


  } catch (err) {
    console.log("Registration error:", err)
    res.json({ status: false, error: "Server error!" })
  }
})