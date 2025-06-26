import express from 'express' // Express.js
import cors from 'cors' // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat
import {pool,local} from './db.js' // Defines the connection pool for the database

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
      'SELECT * FROM AccountsTable'
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

    if (inputUsername == '' || inputPassword == ''){
      return res.json({ status : "Input Something!"}) // returns error message if username or password is empty
    }

    const usernamePasswordMatch = await pool.query( // Gets the db object message of the result of the query
      'SELECT accountid FROM AccountsTable where accountusername = ($1) and accountpassword = ($2)', [inputUsername, inputPassword]
    );

    if (usernamePasswordMatch.rows.length > 0){ // Checks inside the db object if any rows are returned from db
      return res.json({ status : "Account already exists"}) // If rows > 0, the account already exists in db 
    }

    const latestResult = await pool.query( // searches the highest account id in the db
      'SELECT accountid FROM AccountsTable ORDER BY accountid::int DESC LIMIT 1'
    );

    const latestId = latestResult.rows.length > 0 ? parseInt(latestResult.rows[0].accountid) : 0;
    const newId = latestId + 1; // adds 1 to the highest id to assign to the oncoming created account 

    const result = await pool.query( // Inserts the oncoming created account into db
      'INSERT INTO AccountsTable (accountid,accountusername,accountpassword) VALUES ($1, $2, $3)', [newId, req.body.username, req.body.password]
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

    if (inputUsername == '' || inputPassword == ''){ // returns error message if username or password is empty
      return res.json({ status : "Input Something!"})
    }

    if (inputUsername == 'root'){
      return res.json({ status : "You cannot remove root"}) //prevents user from removing root's account
    }

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM AccountsTable WHERE accountusername = ($1) and accountpassword = ($2)', [req.body.username, req.body.password]
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

//Display Calenders
app.get('/home/showAllCalenders', async (req, res) => {
  try {
    const result = await pool.query( // searches for all calenders in the database
      'SELECT * FROM mycalenderstable'
    );
    
    return res.json(result)
  } catch (e){
    console.log("ShowAllAccounts: Server Error")
    console.log(e)
    return res.json(e)
  }
})

//Create Calenders
app.post('/home/createCalender', async (req, res) => {
  try {

    const calenderName = req.body.calenderName
    const calenderDescription = req.body.calenderDescription
    const currentAccountId = req.body.accountid

    console.log(currentAccountId)

    if (calenderName == ''){
      return res.json({ status : "Input Something!"}) // returns error message if username or password is empty
    }

    const checkCalenderInsideDbResult = await pool.query( // Gets the db object of the calender name if it's already there
      'SELECT mycalendername FROM mycalenderstable where mycalendername = ($1)', [calenderName]
    );

    if (checkCalenderInsideDbResult.rows.length > 0){ // Checks inside the db object if any rows are returned from db
      return res.json({ status : "Calender already exists"}) // If rows > 0, the calender already exists in db 
    }

    const latestResult = await pool.query( // searches the highest calender id in the db
      'SELECT mycalenderid FROM mycalenderstable ORDER BY mycalenderid::int DESC LIMIT 1'
    );

    const latestId = latestResult.rows.length > 0 ? parseInt(latestResult.rows[0].mycalenderid) : 0;
    const newId = latestId + 1; // adds 1 to the highest id to assign to the oncoming created calender 

    const result = await pool.query( // Inserts the oncoming created calender into db
      'INSERT INTO mycalenderstable (mycalenderid,mycalendername,mycalenderdescription, accountid) VALUES ($1, $2, $3, $4)', [newId, calenderName, calenderDescription, currentAccountId]
    );
    
    return res.json({ status: 'Calender created' })
  } catch (e){
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create calender' })
  }
})

//Delete Calender
app.delete('/home/deleteCalender', async (req, res) => {
  try {

    const mycalenderid = req.body.calenderid

    if (mycalenderid == '' ){ // returns error message if mycalenderid from req is empty
      return res.json({ status : "mycalenderid contains nothing!"})
    }

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM mycalendersTable WHERE mycalenderid = ($1)', [mycalenderid]
    );

    if (result.rowCount === 0){ // if result constant has no rows, it means no rows are deleted
      return res.json({ status : "No such calender in Databse"})
    } else {
      return res.json({ status : "Calender Deleted"})
    }
  } catch (e){
    console.log("deleteCalenders: Server Error")
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
    
    const result = await local.query( 
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
    const result = await local.query( 
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
      'SELECT * FROM accountsTable WHERE accountusername = $1',
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