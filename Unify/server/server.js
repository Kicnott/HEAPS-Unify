import express from 'express' // Express.js
import cors from 'cors' // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat
import pool from './db.js' // Defines the connection pool for the database

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data, which is (probably??) what we will use


pool.query('SELECT current_database()', (err, res) => {
  if (err) console.error("Connection error:", err);
  else console.log("Connected to DB:", res.rows[0].current_database);
});
  
//Display Accounts
//async tells js that function will take time and return a promise 
//await pauses the function until promise finishes 
app.get('/home/showAllAccounts', async (req, res) => { // 1. url parameter 2. function handling req & res
  try {
    console.log("GetAllAccounts: Connected!")
    
    // use await when function returns a promise. pauses execution until promise settles
    const result = await pool.query( // searches for all accounts in the database. query sends sql commands to database
      'SELECT * FROM AccountTable'
    );
    
    return res.json(result) //send json formatted data back to client
  } catch (e){ //if there is an error
    console.log("GetAllAccounts: Server Error")
    console.log(e)
    return res.json(e)
  }
})

//Create Accounts
app.post('/home/createAccount', async (req, res) => {
  try {

    const inputUsername = req.body.username
    const inputPassword = req.body.password
    const inputDescription = req.body.description

    if (inputUsername == '' || inputPassword == ''){
      return res.json({ status : "Input Something!"}) // returns error message if username or password is empty
    }

    const usernamePasswordMatch = await pool.query( // Gets the db object message of the result of the query
      'SELECT accountid FROM accountTable where accountusername = ($1) and accountpassword = ($2)', [inputUsername, inputPassword]
    )

    if (usernamePasswordMatch.rows.length > 0){ // Checks inside the db object if any rows are returned from db
      return res.json({ status : "Account already exists"}) // If rows > 0, the account already exists in db 
    }

    const result = await pool.query( // Inserts the oncoming created account into db
      'INSERT INTO AccountTable (accountid,accountusername,accountpassword, accountdescription) VALUES (DEFAULT, $1, $2, $3)', [req.body.username, req.body.password, req.body.description]
    );
    
    return res.json({ status: 'Account created' })
  } catch (e){
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create account' })
  }
})

//Delete Accounts
app.delete('/home/deleteAccount', async (req, res) => {
  try {

    const inputUsername = req.body.username
    const inputPassword = req.body.password
    const inputDescription = req.body.description

    if (inputUsername == '' || inputPassword == ''){ // returns error message if username or password is empty
      return res.json({ status : "Input Something!"})
    }

    if (inputUsername == 'root'){
      return res.json({ status : "You cannot remove root"}) //prevents user from removing root's account
    }

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM AccountTable WHERE accountusername = ($1) and accountpassword = ($2)', [req.body.username, req.body.password]
    );

    if (result.rowCount === 0){ // if result constant has no rows, it means no rows are deleted
      return res.json({ status : "No such account in Databse"})
    } else {
      return res.json({ status : "Account Deleted"})
    }
  } catch (e){
    console.log("deleteAccount: Server Error")
    console.log(e)
    return res.json(e)
  }
})

//Display Calendars
app.get('/home/showAllCalendars', async (req, res) => {
  try {
    const result = await pool.query( // searches for all calendars in the database
      'SELECT * FROM calendartable'
    );
    
    return res.json(result)
  } catch (e){
    console.log("ShowAllAccounts: Server Error")
    console.log(e)
    return res.json(e)
  }
})

//Create Calendars
app.post('/home/createCalendar', async (req, res) => {
  try {

    const calendarName = req.body.calendarName
    const calendarDescription = req.body.calendarDescription
    const currentAccountId = req.body.accountid

    console.log(currentAccountId)

    if (calendarName == ''){
      return res.json({ status : "Input Something!"}) // returns error message if username or password is empty
    }

    const checkCalendarInsideDbResult = await pool.query( // Gets the db object of the calendar name if it's already there
      'SELECT calendartable FROM calendartable where calendarname = ($1)', [calendarName]
    );

    if (checkCalendarInsideDbResult.rows.length > 0){ // Checks inside the db object if any rows are returned from db
      return res.json({ status : "Calendar already exists"}) // If rows > 0, the calendar already exists in db 
    }

    const latestResult = await pool.query( // searches the highest calendar id in the db
      'SELECT calendarid FROM calendartable ORDER BY calendarid::int DESC LIMIT 1'
    );

    const result = await pool.query( // Inserts the oncoming created calendar into db
      'INSERT INTO calendartable (calendarid,calendarname,calendardescription, accountid) VALUES ($1, $2, $3, $4)', [DEFAULT, calendarName, calendarDescription, currentAccountId]
    );
    
    return res.json({ status: 'Calendar created' })
  } catch (e){
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create calendar' })
  }
})

//Delete Calendar
app.delete('/home/deleteCalendar', async (req, res) => {
  try {

    const calendarid = req.body.calendarid

    if (calendarid == '' ){ // returns error message if mycalendarid from req is empty
      return res.json({ status : "calendarid contains nothing!"})
    }

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM calendarTable WHERE calendarid = ($1)', [calendarid]
    );

    if (result.rowCount === 0){ // if result constant has no rows, it means no rows are deleted
      return res.json({ status : "No such calendar in Databse"})
    } else {
      return res.json({ status : "Calendar Deleted"})
    }
  } catch (e){
    console.log("deleteCalendar: Server Error")
    console.log(e)
    return res.json(e)
  }
})

// replace local pool with supabase pool if events table is there
app.post('/home/createEvent', async(req, res) => {
  
  try {
    const eventname = req.body.name;
    const eventdescription = req.body.description;
    const eventlocation = req.body.location;
    const startdt = req.body.startdt;
    const enddt = req.body.enddt;
    
    const result = await pool.query( 
      'INSERT INTO public.events (eventname,eventdescription,eventlocation,startdt,enddt) VALUES ($1, $2, $3, $4, $5)', [eventname,eventdescription,eventlocation,startdt,enddt]
    );   

    return res.json({ status : "event created"});
  } catch (e) {
    console.log("createEvent: Server Error");
    console.log(e);
    return res.json({ status: 'Failed to create event' });
  }
})

app.get('/home/showAllEvents', async (req, res) => {
  try {
    console.log("showAllEvents: Connected!");
    const result = await pool.query( 
      'SELECT * FROM events'
    );
    return res.json(result);
  } catch (e) {
    console.log("showAllEvents: Server Error");
    console.log(e);
    return res.json(e);
  }
})

// Login authentification
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query( // searches for user in the database
      'SELECT * FROM accountTable WHERE accountusername = $1',
      [username]
    );

    const user = result.rows[0]; //gets the username from the db, if username does not exists it returns undefined
    console.log(user)

    if (user && user.accountpassword === password) {
      console.log("Data matches!");
      const userid = user.accountid;
      res.json({ status: true, userid: userid}); // Return true if username and password matches database
    } else {
      console.log("Data does not match");
      res.json({ status: false }); // Return false if username and password does not match database
    }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) // Starts the server and sends the message when there are any requests from port 8888







// JR's REGISTRATION STUFF


app.post("/register", async (req, res) => {
  const { yourName, username, password, accountDescription } = req.body;

  console.log(req.body);

  try {
    const userCheck = await pool.query(
      'SELECT * FROM accounttable WHERE accountusername = $1',
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
        'INSERT INTO accounttable (accountid, accountusername, accountpassword, accountdescription) VALUES (DEFAULT, $1, $2, $3)',
        [username, password, accountDescription]
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