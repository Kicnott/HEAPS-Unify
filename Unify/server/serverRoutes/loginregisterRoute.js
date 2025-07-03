import express from 'express'
import pool from '../db.js'; 
const router = express.Router()

// Login authentification
router.post("/login", async (req, res) => {
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

// Registration stuff
router.post("/register", async (req, res) => {
  const { yourName, username, password, accountDescription } = req.body;

  console.log(req.body);

  try {
    const userCheck = await pool.query(
      'SELECT * FROM accountstable WHERE accountusername = $1',
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
        'INSERT INTO accountstable (accountid, accountusername, accountpassword, accountdescription) VALUES (DEFAULT, $1, $2, $3)',
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

export default router