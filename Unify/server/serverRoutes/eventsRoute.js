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
    const calendarid = 1
    
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

//get events for the month calendar grid
router.get('/home/getMonthEvents', async (req, res) => {
  try {
    console.log("getMonthEvents: Connected!");
    const currMonth = Number(req.query.currMonth);

    const result = await pool.query( 
      'SELECT * FROM eventstable'
    );
    const filterEvents = result.rows.filter((event)=>{
      const eventDate = new Date(event.startdt);
      return eventDate.getMonth() === currMonth;
  })
    console.log('filter:', filterEvents);
    return res.json(filterEvents);
  } catch (e) {
    console.log("getMonthEvents: Server Error");
    console.log(e);
    return res.json(e);
  }
})

export default router