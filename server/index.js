// /server/index.js
const express = require('express');
const app = express();
const deviceRoutes = require('./routes/device');
const cors = require('cors');

app.use(cors());
app.use('/api', deviceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Listening at the http://localhost:${PORT}`);
})
