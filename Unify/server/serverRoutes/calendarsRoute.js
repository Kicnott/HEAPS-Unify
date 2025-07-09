import express from 'express'
import pool from '../db.js';
const router = express.Router()

//Display Calendars
router.get('/home/showAllCalendars', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*,
          (
            SELECT COUNT(DISTINCT followid)
            FROM followedcalendarstable f
            WHERE f.calendarid = c.calendarid
          ) AS followercount
     FROM calendarstable c
     ORDER BY followercount DESC, c.calendarid ASC`
    );

    return res.json(result)
  } catch (e) {
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
      `SELECT c.*,
          (
            SELECT COUNT(DISTINCT followid)
            FROM followedcalendarstable f
            WHERE f.calendarid = c.calendarid
          ) AS followercount
     FROM calendarstable c
     WHERE c.accountid = $1
     ORDER BY followercount DESC, c.calendarid ASC`,
      [accountid]
    );

    // console.log(result)

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
    const calendarPrivacy = req.body.calendarPrivacy
    const calendarColour = req.body.calendarColour

    console.log(currentAccountId)

    if (calendarName == '') {
      return res.json({ status: "Input Something!" }) 
    }

    const checkCalendarInsideDbResult = await pool.query( 
      'SELECT calendarstable FROM calendarstable where calendarname = ($1)', [calendarName]
    );

    if (checkCalendarInsideDbResult.rows.length > 0) { 
      return res.json({ status: "Calendar already exists" }) 
    }


    const result = await pool.query( 
      'INSERT INTO calendarstable (calendarname,calendardescription, accountid, calendarprivacy, calendarcolour) VALUES ($1, $2, $3, $4, $5)', [calendarName, calendarDescription, currentAccountId, calendarPrivacy, calendarColour]
    );

    return res.json({ status: 'Calendar created' })
  } catch (e) {
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create calendar' })
  }
})

//Delete Calendar
router.delete('/home/deleteCalendar', async (req, res) => {
  try {

    const calendarid = req.body.calendarid

    if (calendarid == '') { // returns error message if mycalendarid from req is empty
      return res.json({ status: "calendarid contains nothing!" })
    }

    // console.log(res)

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM calendarstable WHERE calendarid = ($1)', [calendarid]
    );

    if (result.rowCount === 0) { // if result constant has no rows, it means no rows are deleted
      return res.json({ status: "No such calendar in Database" })
    } else {
      return res.json({ status: "Calendar Deleted" })
    }
  } catch (e) {
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

    // console.log("GetCalendar: Connected!");

    const result = await pool.query(
      `SELECT c.*,
          (
            SELECT COUNT(DISTINCT followid)
            FROM followedcalendarstable f
            WHERE f.calendarid = c.calendarid
          ) AS followercount
     FROM calendarstable c
     WHERE c.calendarid = $1
     ORDER BY followercount DESC, c.calendarid ASC`,
      [calendarid]
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

router.post('/home/followCalendar', async (req, res) => {
  try {
    const calendarid = req.body.calendarid
    const accountid = req.body.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ error: 'Missing calendarid or accountid parameter' });
    }

    // console.log("FollowCalendar: Connected!");

    const checkFollowed = await pool.query(
      'SELECT * FROM followedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (checkFollowed.rows.length > 0) {
      return res.json({ status: 'Already following this calendar' });
    }

    await pool.query(
      'INSERT INTO followedcalendarstable (calendarid, accountid) VALUES ($1, $2)', [calendarid, accountid]
    );

    return res.json({ status: 'Successfully followed the calendar' });
  } catch (e) {
    console.log("FollowCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.get('/home/checkFollowedCalendar', async (req, res) => {
  try {
    const calendarid = req.query.calendarid
    const accountid = req.query.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ error: 'Missing calendarid or accountid parameter' });
    }

    // console.log("CheckFollowedCalendar: Connected!");

    const result = await pool.query(
      'SELECT * FROM followedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (result.rows.length > 0) {
      return res.json({ status: true });
    } else {
      return res.json({ status: false });
    }
  } catch (e) {
    console.log("CheckFollowedCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.get('/home/getFollowedCalendars', async (req, res) => {
  try {
    const accountid = req.query.accountid

    if (!accountid) {
      return res.status(400).json({ error: 'Missing accountid parameter' });
    }

    // console.log("GetFollowedCalendars: Connected!");

    const result = await pool.query(
      'SELECT * FROM followedcalendarstable WHERE accountid = $1', [accountid]
    );

    return res.json({ rows: result.rows });
  } catch (e) {
    console.log("GetFollowedCalendars: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.delete('/home/unfollowCalendar', async (req, res) => {
  try {
    const calendarid = req.body.calendarid
    const accountid = req.body.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ error: 'Missing calendarid or accountid parameter' });
    }

    // console.log("UnfollowCalendar: Connected!");

    const result = await pool.query(
      'DELETE FROM followedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (result.rowCount === 0) {
      return res.json({ status: 'Not following this calendar' });
    } else {
      return res.json({ status: 'Successfully unfollowed the calendar' });
    }
  } catch (e) {
    console.log("UnfollowCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.get('/home/getMyDisplayedCalendars', async (req, res) => {
  try {
    const accountid = req.query.accountid

    if (!accountid) {
      return res.status(400).json({ error: 'Missing accountid parameter' });
    }

    // console.log("GetMyDisplayedCalendars: Connected!");

    const result = await pool.query(
      'SELECT * FROM displayedcalendarstable WHERE accountid = $1', [accountid]
    );

    return res.json({ rows: result.rows });
  } catch (e) {
    console.log("GetMyDisplayedCalendars: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.get('/home/checkDisplayedCalendar', async (req, res) => {
  try {
    const calendarid = req.query.calendarid
    const accountid = req.query.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ error: 'Missing calendarid or accountid parameter' });
    }

    // console.log("CheckDisplayedCalendar: Connected!");

    const result = await pool.query(
      'SELECT * FROM displayedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (result.rows.length > 0) {
      return res.json({ status: true });
    } else {
      return res.json({ status: false });
    }
  } catch (e) {
    console.log("CheckDisplayedCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ error: 'Server error' });
  }
})

router.post('/home/displayCalendar', async (req, res) => {
  try {
    const calendarid = req.body.calendarid
    const accountid = req.body.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ status: false });
    }

    // console.log("DisplayCalendar: Connected!");

    const checkDisplayed = await pool.query(
      'SELECT * FROM displayedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (checkDisplayed.rows.length > 0) {
      return res.json({ status: false });
    }

    await pool.query(
      'INSERT INTO displayedcalendarstable (calendarid, accountid) VALUES ($1, $2)', [calendarid, accountid]
    );

    return res.json({ status: true });
  } catch (e) {
    console.log("DisplayCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ status: false });
  }
})

router.delete('/home/undisplayCalendar', async (req, res) => {
  try {
    const calendarid = req.body.calendarid
    const accountid = req.body.accountid

    if (!calendarid || !accountid) {
      return res.status(400).json({ status: false });
    }

    // console.log("UndisplayCalendar: Connected!");

    const result = await pool.query(
      'DELETE FROM displayedcalendarstable WHERE calendarid = $1 AND accountid = $2', [calendarid, accountid]
    );

    if (result.rowCount === 0) {
      return res.json({ status: false });
    } else {
      return res.json({ status: true });
    }
  } catch (e) {
    console.log("UndisplayCalendar: Server Error");
    console.log(e);
    return res.status(500).json({ status: false });
  }
})

router.post('/home/changeCalendarColor', async (req, res) => {
  try {
    const calendarid = req.body.calendarid
    const color = req.body.color
    if (!calendarid || !color) {
      return res.status(400).json({ error: "calendarid or color missing!" })
    }

    console.log("ChangeCalendarColor: Connected!")
    const result = await pool.query(
      'UPDATE calendarstable SET calendarcolour = $1 WHERE calendarid = $2', [color, calendarid]
    )
    if (result.rowCount === 0) {
      console.log("Calendar Colour change failed!")
      return res.json({ status: false })
    }
    else {
      console.log("Calendar Colour change success!")
      return res.json({ status: true })
    }

  }
  catch (e) {
    console.log("Trouble changing calendar color!")
    console.log(e)
    return res.status(500).json({ error: "Server error!" })
  }
})

router.get('/home/calendarFollowerCount', async (req, res) => {
  try {
    const calendarid = req.query.calendarid

    const result = await pool.query(
      "SELECT COUNT(DISTINCT followerid) FROM followedcalendarstable WHERE calendarid = $1",
      [calendarid]
    )

    return res.json(result)
  }
  catch (e) {
    console.log("calendarFollowerCount: Server error")
    console.log(e)
    return res.json(e)
  }
})


export default router