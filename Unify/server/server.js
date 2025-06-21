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