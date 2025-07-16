import express from 'express'
import pool from '../db.js';
const router = express.Router()


function addToDate(date, { days = 0, weeks = 0, months = 0, years = 0 }) {
  const newDate = new Date(date);
  if (days) newDate.setDate(newDate.getDate() + days);
  if (weeks) newDate.setDate(newDate.getDate() + 7 * weeks);
  if (months) newDate.setMonth(newDate.getMonth() + months);
  if (years) newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

router.post('/home/createEvent', async (req, res) => {
  try {
    const {
      name: eventname,
      description: eventdescription,
      location: eventlocation,
      startdt,
      enddt,
      calendarID: calendarid,
      repeat = 'none',
      repeatUntil,
    } = req.body;

    const insertQuery = `
      INSERT INTO public.eventstable 
      (eventname, eventdescription, eventlocation, startdt, enddt, calendarid)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    if (
      typeof repeat === 'string' &&
      repeat.toLowerCase() !== 'none' &&
      repeatUntil &&
      !isNaN(Date.parse(repeatUntil))
    ) {
      const freqMap = {
        daily: { days: 1 },
        weekly: { weeks: 1 },
        monthly: { months: 1 },
        yearly: { years: 1 },
      };

      const freq = freqMap[repeat.toLowerCase()];
      if (!freq) {
        return res.status(400).json({ status: 'Invalid repeat value' });
      }

      const untilDate = new Date(repeatUntil);
      untilDate.setHours(23, 59, 59, 999);

      let currentStart = new Date(startdt);
      let currentEnd = new Date(enddt);
      let counter = 0;
      const MAX_INSTANCES = 1000;

      while (currentStart <= untilDate && counter < MAX_INSTANCES) {
        await pool.query(insertQuery, [
          eventname,
          eventdescription,
          eventlocation,
          currentStart.toISOString(),
          currentEnd.toISOString(),
          calendarid,
        ]);

        currentStart = addToDate(currentStart, freq);
        currentEnd = addToDate(currentEnd, freq);
        counter++;
      }

      if (counter === MAX_INSTANCES) {
        console.warn('Max repeat limit hit, ending early.');
      }

      console.log('Recurring events created:', counter);
      return res.json({ status: 'Recurring events created', count: counter });
    }

    await pool.query(insertQuery, [
      eventname,
      eventdescription,
      eventlocation,
      startdt,
      enddt,
      calendarid,
    ]);

    console.log('Single event created');
    return res.json({ status: 'Event created' });

  } catch (e) {
    console.error('createEvent: Server Error', e);
    return res.status(500).json({ status: 'Failed to create event' });
  }
});



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
    return res.status(500).json({ error: 'Server error' })
  }
});


// get only the events for the month
router.get('/home/getMonthEvents', async (req, res) => {
  try {
    // console.log("getMonthEvents: Connected!");

    const result = await pool.query(
      'SELECT * FROM eventstable, calendarstable where eventstable.calendarid = calendarstable.calendarid'
    );

    return res.json(result.rows);
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
    return res.json(false);
  }
})


//add modify and delete route
router.delete('/home/deleteEvent/:id', async (req, res) => {
  try {
    const eventid = req.params.id;

    const result = await pool.query(
      'DELETE FROM eventstable WHERE eventid = ($1)', [eventid]
    )

    if (result.rowCount === 0) { 
      return res.json({ status: "Failed to delete event" });
    } else {
      return res.json({ status: "Event deleted" });
    }
  } catch (e) {
    console.log("deleteEvent: Server Error");
    console.log(e);
    return res.json(e);
  }
})

router.delete('/home/deleteDuplicateEvent/:id/:name', async (req, res) => {
  try {
    const calendarid = req.params.id;
    const eventname = req.params.name;

    const result = await pool.query(
      'DELETE FROM eventstable WHERE calendarid = $1 AND eventname = $2',
      [calendarid, eventname]
    );

    if (result.rowCount === 0) {
      return res.json({ status: "Failed to delete events" });
    } else {
      return res.json({ status: "Event(s) deleted" });
    }
  } catch (e) {
    console.log("deleteDuplicateEvent: Server Error");
    console.log(e);
    return res.status(500).json({ status: "Server error deleting duplicate events" });
  }
});


router.post('/home/modifyEvent', async (req, res) => {
  try {

    const startdt = req.body.startdt;
    const enddt = req.body.enddt;
    const eventid = req.body.eventid;
    const eventname = req.body.eventname
    const eventdescription = req.body.eventdescription
    const eventlocation = req.body.eventlocation

    const result = await pool.query(
      'UPDATE eventstable SET eventname = $2, eventdescription = $3, eventlocation = $4, startdt = $5, enddt = $6 WHERE eventid = $1', [eventid, eventname, eventdescription, eventlocation, startdt, enddt]
    );
    return res.json(true);
  } catch (e) {
    console.log("modifyEvent: Server Error");
    console.log(e);
    return res.json(false);
  }
})

export default router