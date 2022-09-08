const express = require('express');
const serverless=require('serverless-http')
const cors = require('cors');
const app = express();
const query=require('./database/query.js');



app.use(cors());
query();

// Your first API endpoint
app.get('/', function(req, res) {
  
  res.json({ greeting: 'hello API' });
});

module.exports.handler=serverless(app)
