// import * as db from './db.js';
import express from 'express';
// create an Express.js server (aka app)
const app = express();

// Serve files from the 'client' directory
app.use(express.static('client'));

// make the server available on the network
app.listen(8080);
