import express from 'express'
import pool from '../db.js';
const router = express.Router()

// replace local pool with supabase pool if eventstable table is there
router.post('/home/createEvent', async (req, res) => {

  try {
    const eventname = req.body.name;
    const eventdescription = req.body.description;
    const eventlocation = req.body.location;
    const startdt = req.body.startdt;
    const enddt = req.body.enddt;
    const calendarid = req.body.calendarID;

    const result = await pool.query(
      'INSERT INTO public.eventstable (eventname,eventdescription,eventlocation,startdt,enddt, calendarid) VALUES ($1, $2, $3, $4, $5, $6)', [eventname, eventdescription, eventlocation, startdt, enddt, calendarid]
    );

    return res.json({ status: "event created" });
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
    const calendarid = req.query.calendarid;

    if (!calendarid) {
      return res.status(400).json({ error: 'Missing calendarid parameter' });
    }

    console.log("GetMyEvents: Connected!");

    const result = await pool.query(
      'SELECT * FROM eventstable WHERE calendarid = $1 ORDER BY startdt ASC', [calendarid])

    return res.json({ rows: result.rows });
  } catch (e) {
    console.log("GetMyEvents: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.get('/home/getEvent', async (req, res) => {
  try {
    const eventid = req.query.eventid;

    if (!eventid) {
      return res.status(400).json({ error: 'Missing eventid parameter' });
    }

    // console.log("GetEvent: Connected!");

    const result = await pool.query(
      'SELECT * FROM eventstable WHERE eventid = $1', [eventid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json(result.rows[0]);
  } catch (e) {
    console.log("GetEvent: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' })}});


// get only the events for the month
router.get('/home/getMonthEvents', async (req, res) => {
  try {
    // console.log("getMonthEvents: Connected!");
    console.log("req: ", req.query)
    const currMonth = Number(req.query.currMonth);

    console.log(currMonth)

    const result = await pool.query( 
      'SELECT * FROM eventstable'
    );
    const filterEvents = result.rows.filter((event)=>{
      let filtered = false
      const eventDate = new Date(event.startdt);
      const startDayValue = eventDate.getDate();

      if (eventDate.getMonth() === currMonth){
        filtered = true;
      } else if ((eventDate.getMonth() === (currMonth - 1)) && startDayValue > 23){ // get events from the previous month
        filtered = true;
      } else if ((eventDate.getMonth() === (currMonth + 1)) && startDayValue < 7){ // get events from the next month
        filtered = true;
      }
      return filtered;
  })

    return res.json(filterEvents);
  } catch (e) {
    console.log("getMonthEvents: Server Error");
    console.log(e);
    return res.json(e);
  }
})

router.put('/home/updateEvent', async (req, res) => {
  try {
    // console.log("updateEvents: Connected!");

    const newStartDt = req.body.newStartDt;
    const newEndDt = req.body.newEndDt;
    const eventId = req.body.eventId;

    const result = await pool.query( 
      'UPDATE eventstable SET startdt = ($1), enddt = ($2) WHERE eventid = ($3)', [newStartDt, newEndDt, eventId]
    );
    return res.json(true);
  } catch (e) {
    console.log("updateEvent: Server Error");
    console.log(e);
    return res.json(false);}
})


//add modify and delete route
router.delete('/home/deleteEvent/:id', async(req, res) => {
  try {
    const eventid = req.params.id;

    const result = await pool.query(
      'DELETE FROM eventstable WHERE eventid = ($1)', [eventid]
    )

    if (result.rowCount === 0){ // if result constant has no rows, it means no rows are deleted
      return res.json({ status : "Failed to delete event"});
    } else {
      return res.json({ status : "Event deleted"});
    }
  } catch (e){
    console.log("deleteEvent: Server Error");
    console.log(e);
    return res.json(e);
  }
})

export default router