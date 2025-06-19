const express = require('express') // Express.js
const cors = require('cors') // Cross-Origin Resource Sharing: To configure requests to the server; We do not need it until we deploy stuff
const app = express() // Creates a variable of the Express app
const port = 8888 // Defines the port number as 8888 for the huat

app.use(cors()) // Makes the Express app use cors
app.use(express.json()) // Makes the Express app read incoming json data, which is (probably??) what we will use

app.get('/', (req, res) => {
  res.send('Hey ho server is up')
}) // For testing. Run the server and go to localhost:8888 to see message

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) // Starts the server and sends the message when there are any requests from port 8888

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello the server is working'})
    console.log('A request hath been made')
})