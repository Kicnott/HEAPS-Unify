import express from 'express'
import pool from '../db.js'; 
const router = express.Router()

//Display Calendars
router.get('/home/showAllCalendars', async (req, res) => {
  try {
    const result = await pool.query( // searches for all calendarstable in the database
      'SELECT * FROM calendarstable'
    );
    
    return res.json(result)
  } catch (e){
    console.log("ShowAllAccounts: Server Error")
    console.log(e)
    return res.json(e)
  }
})

router.get('/home/getMyCalendars', async (req, res) => {
  try {
    const accountid = req.query.accountid

    if (!accountid) {
      return res.status(400).json({ error: 'Missing accountid parameter' });
    }

    console.log("GetMyCalendars: Connected!");

    const result = await pool.query(
      'SELECT * FROM calendarstable WHERE accountid = $1', [accountid]
    );

    console.log(result)

    return res.json(result)
  } catch (e) {
    console.log("GetMyCalendars: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

//Create Calendars
router.post('/home/createCalendar', async (req, res) => {
  try {

    const calendarName = req.body.calendarName
    const calendarDescription = req.body.calendarDescription
    const currentAccountId = req.body.accountid

    console.log(currentAccountId)

    if (calendarName == ''){
      return res.json({ status : "Input Something!"}) // returns error message if username or password is empty
    }

    const checkCalendarInsideDbResult = await pool.query( // Gets the db object of the calendar name if it's already there
      'SELECT calendarstable FROM calendarstable where calendarname = ($1)', [calendarName]
    );

    if (checkCalendarInsideDbResult.rows.length > 0){ // Checks inside the db object if any rows are returned from db
      return res.json({ status : "Calendar already exists"}) // If rows > 0, the calendar already exists in db 
    }

    const latestResult = await pool.query( // searches the highest calendar id in the db
      'SELECT calendarid FROM calendarstable ORDER BY calendarid::int DESC LIMIT 1'
    );

    const newCalendarId = parseInt(latestResult.rows[0].calendarid, 10) + 1;

    const result = await pool.query( // Inserts the oncoming created calendar into db
      'INSERT INTO calendarstable (calendarid,calendarname,calendardescription, accountid) VALUES ($1, $2, $3, $4)', [newCalendarId, calendarName, calendarDescription, currentAccountId]
    );
    
    return res.json({ status: 'Calendar created' })
  } catch (e){
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create calendar' })
  }
})

//Delete Calendar
router.delete('/home/deleteCalendar', async (req, res) => {
  try {

    const calendarid = req.body.calendarid

    if (calendarid == '' ){ // returns error message if mycalendarid from req is empty
      return res.json({ status : "calendarid contains nothing!"})
    }

    console.log(res)

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM calendarstable WHERE calendarid = ($1)', [calendarid]
    );

    if (result.rowCount === 0){ // if result constant has no rows, it means no rows are deleted
      return res.json({ status : "No such calendar in Database"})
    } else {
      return res.json({ status : "Calendar Deleted"})
    }
  } catch (e){
    console.log("deleteCalendar: Server Error")
    console.log(e)
    return res.json(e)
  }
})

router.get('/home/getCalendar', async (req, res) => {
  try {
    const calendarid = req.query.calendarid

    if (!calendarid) {
      return res.status(400).json({ error: 'Missing calendarid parameter' });
    }

    console.log("GetCalendar: Connected!");

    const result = await pool.query(
      'SELECT * FROM calendarstable WHERE calendarid = $1', [calendarid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calendar not found' });
    }

    return res.json(result.rows[0]);
  } catch (e) {
    console.log("GetCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

export default router