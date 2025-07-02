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
      'SELECT * FROM eventstable WHERE calendarid = $1', [calendarid])

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

    console.log("GetEvent: Connected!");

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
    return res.status(500).json({ error: 'Server error' });
  }
})

export default router