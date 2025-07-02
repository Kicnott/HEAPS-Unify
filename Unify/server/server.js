import express from 'express' // Express.js
import cors from 'cors' // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
import accountsRoutes from './serverRoutes/accountsRoute.js'
import calendarsRoutes from './serverRoutes/calendarsRoute.js'
import eventsRoutes from './serverRoutes/eventsRoute.js'
import loginregisterRoutes from './serverRoutes/loginregisterRoute.js'
import pool from './db.js' // Defines the connection pool for the database
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data, which is (probably??) what we will use
app.use('/', accountsRoutes); // Mount accounts router
app.use('/', calendarsRoutes); // Mount calendars router
app.use('/', eventsRoutes); // Mount event router
app.use('/', loginregisterRoutes); // Mount login & register router

pool.query('SELECT current_database()', (err, res) => {
  if (err) console.error("Connection error:", err);
  else console.log("Connected to DB:", res.rows[0].current_database);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) // Starts the server and sends the message when there are any requests from port 8888
 
