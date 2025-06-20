import express from 'express';
import cors from 'cors';
import db from './components/db.initialize.js'; 

const app = express();
const port = 5473;

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data

db.sequelize.sync()
  .then(() => {
    console.log("Database synced");
}).catch((err) => {
    console.error("Sync error:", err);
});

app.get('/', (req, res) => {
  res.send('Server sends response')
}) 

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 