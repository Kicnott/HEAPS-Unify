import express from 'express'
import pool from '../db.js';
const router = express.Router()


//Display Accounts
//async tells js that function will take time and return a promise 
//await pauses the function until promise finishes 
router.get('/home/showAllAccounts', async (req, res) => { // 1. url parameter 2. function handling req & res
  try {
    // console.log("GetAllAccounts: Connected!")

    // use await when function returns a promise. pauses execution until promise settles
    const result = await pool.query(
      `SELECT a.*,
          (
            SELECT COUNT(f.followid)
            FROM calendarstable c
            LEFT JOIN followedcalendarstable f ON c.calendarid = f.calendarid
            WHERE c.accountid = a.accountid
          ) AS followercount
     FROM accountstable a
     ORDER BY followercount DESC, a.accountid ASC`
    );

    return res.json(result) //send json formatted data back to client
  } catch (e) { //if there is an error
    console.log("GetAllAccounts: Server Error")
    console.log(e)
    return res.json(e)
  }
})

router.get('/home/searchAccounts', async (req, res) => {
  try {
    const search = req.query.search

    const result = await pool.query(
      `SELECT a.*,
           COUNT(f.followid) AS followercount
     FROM accountstable a
     LEFT JOIN calendarstable c ON a.accountid = c.accountid
     LEFT JOIN followedcalendarstable f ON c.calendarid = f.calendarid
    WHERE a.accountusername ILIKE $1
    GROUP BY a.accountid
    ORDER BY followercount DESC, a.accountid ASC`,
      [`%${search}%`]
    )

    return res.json(result)
  }
  catch (e) {
    console.log("searchAccount: Server error")
    console.log(e)
    return res.json(e)
  }
})


//Create Accounts
router.post('/home/createAccount', async (req, res) => {
  try {

    const inputUsername = req.body.username
    const inputPassword = req.body.password
    const inputDescription = req.body.description

    if (inputUsername == '' || inputPassword == '') {
      return res.json({ status: "Input Something!" }) // returns error message if username or password is empty
    }

    const usernamePasswordMatch = await pool.query( // Gets the db object message of the result of the query
      'SELECT accountid FROM accountstable where accountusername = ($1) and accountpassword = ($2)', [inputUsername, inputPassword]
    )

    if (usernamePasswordMatch.rows.length > 0) { // Checks inside the db object if any rows are returned from db
      return res.json({ status: "Account already exists" }) // If rows > 0, the account already exists in db 
    }

    const result = await pool.query( // Inserts the oncoming created account into db
      'INSERT INTO accountstable (accountusername,accountpassword, accountdescription) VALUES ($1, $2, $3)', [req.body.username, req.body.password, req.body.description]
    );

    return res.json({ status: 'Account created' })
  } catch (e) {
    console.log("createAccount: Server Error")
    console.log(e)
    return res.json({ status: 'Failed to create account' })
  }
})

//Delete Accounts
router.delete('/home/deleteAccount', async (req, res) => {
  try {

    const inputUsername = req.body.username
    const inputPassword = req.body.password
    const inputDescription = req.body.description

    if (inputUsername == '' || inputPassword == '') { // returns error message if username or password is empty
      return res.json({ status: "Input Something!" })
    }

    if (inputUsername == 'root') {
      return res.json({ status: "You cannot remove root" }) //prevents user from removing root's account
    }

    const result = await pool.query( // result constant contains db object of any rows that are deleted
      'DELETE FROM accountstable WHERE accountusername = ($1) and accountpassword = ($2)', [req.body.username, req.body.password]
    );

    if (result.rowCount === 0) { // if result constant has no rows, it means no rows are deleted
      return res.json({ status: "No such account in Database" })
    } else {
      return res.json({ status: "Account Deleted" })
    }
  } catch (e) {
    console.log("deleteAccount: Server Error")
    console.log(e)
    return res.json(e)
  }
})

router.get('/home/getAccount', async (req, res) => {
  try {
    const accountid = req.query.accountid;

    if (!accountid) {
      return res.status(400).json({ error: 'Missing accountid parameter' });
    }

    console.log("GetAccount: Connected!");

    const result = await pool.query(
      `SELECT a.*,
          (
            SELECT COUNT(f.followid)
            FROM calendarstable c
            LEFT JOIN followedcalendarstable f ON c.calendarid = f.calendarid
            WHERE c.accountid = a.accountid
          ) AS followercount
     FROM accountstable a
     WHERE a.accountid = $1`,
      [accountid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.json(result.rows[0]);
  } catch (e) {
    console.log("GetAccount: Server Error");
    console.log(e);
    return res.json(e);
  }
})

export default router