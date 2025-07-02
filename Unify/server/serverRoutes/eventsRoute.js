import express from 'express'
import pool from '../db.js'; 
const router = express.Router()

// replace local pool with supabase pool if eventstable table is there
router.post('/home/createEvent', async(req, res) => {
  
  try {
    const eventname = req.body.name;
    const eventdescription = req.body.description;
    const eventlocation = req.body.location;
    const startdt = req.body.startdt;
    const enddt = req.body.enddt;
    const calendarid = req.body.calendarID;
    
    const result = await pool.query( 
      'INSERT INTO public.eventstable (eventname,eventdescription,eventlocation,startdt,enddt, calendarid) VALUES ($1, $2, $3, $4, $5, $6)', [eventname,eventdescription,eventlocation,startdt,enddt, calendarid]
    );   

    return res.json({ status : "event created"});
  } catch (e) {
    console.log("createEvent: Server Error");
    console.log(e);
    return res.json({ status: 'Failed to create event' });
  }
})

router.get('/home/showAllEvents', async (req, res) => {
  try {
    // console.log("showAllEvents: Connected!");
    const result = await pool.query( 
      'SELECT * FROM eventstable'
    );
    return res.json(result);
  } catch (e) {
    console.log("showAllEvents: Server Error");
    console.log(e);
    return res.json(e);
  }
})

router.get('/home/getMyEvents', async (req, res) => {
  try {
    const accountid = req.query.accountid;

    if (!accountid) {
      return res.status(400).json({ error: 'Missing accountid parameter' });
    }

    console.log("GetMyEvents: Connected!");

    const calendarids = await pool.query(
      'SELECT calendarid FROM calendarstable WHERE accountid = $1', [accountid]
    );

    console.log("Calendar IDs: ", calendarids.rows);

    const eventResults = await Promise.all(
      calendarids.rows.map(row =>
        pool.query('SELECT * FROM eventstable WHERE calendarid = $1', [row.calendarid])
      )
    );

    console.log("Event Results: ", eventResults);

    const events = eventResults.flatMap(result => result.rows);

    return res.json({ rows: events });
  } catch (e) {
    console.log("GetMyEvents: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})


export default router