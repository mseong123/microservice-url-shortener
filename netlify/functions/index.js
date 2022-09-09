const express = require('express');
const serverless=require('serverless-http')
const cors = require('cors');
const app = express();
const dnsPromises=require('node:dns').promises;
const URLModel=require('./database/models/URL.js');
const mongoose=require('mongoose');
const validator=require('validator');

/*Didn't use below query plugin module because of weird behaviours -not sure due to netlify config or problem with my plugin code. 
When I query DB using model.findOne or model.find, behavior completely unexpected where it returns all document no matter what i do. Spent
hours on it and couldn't find a way so just wrote without module. Might have something to do with passing,binding and calling the API
Model.find.bind(Model) which is wrong. Originally wanted to use plugin for composability/reuseability of modules for future projects to be 
hosted under netlify.Anyway left the plugin in repo for future reference*/  

//const query=require(./database/query.js)

app.use(express.urlencoded({extended:false}));
app.use(cors());


// API endpoint
//use async/await function for readability otherwise Promise chain hell - see example code at bottom 
app.post('/api/shorturl', async function(req, res) {
  
  try {
          if (validator.isURL(req.body.url,{require_protocol: true})) {
            
            const dns=await dnsPromises.lookup(req.body.url.substr(req.body.url.indexOf('://')+3))
            console.log(dns)
            
            await mongoose.connect(process.env.MONGO_URI);
            res.send('successful connection to DB');
            const result=await URLModel.findOne({
              original_url:req.body.url
            })
              .select('-_id original_url short_url')
              .exec()
            
            if (result) 
              res.json(result)

            else {
              const count=await URLModel.countDocuments();
              let URL=new URLModel({
                original_url:req.body.url,
                short_url:count+1
              })
              const response=await URL.save();
              res.send({
                original_url:response.original_url,
                short_url:response.short_url
              })
            }
          }
          else res.send({
            error: 'invalid url'
          })
      }
  catch(err) {
    console.log(err)
      res.send({
        error: err
      })
    }
  });

  app.get('/api/shorturl/:shorturl', async function(req, res) {
    try {
      console.log('GET '+ req.params.shorturl)
      await mongoose.connect(process.env.MONGO_URI);
      console.log('successful connection to DB');
      const result=await URLModel.findOne({
        short_url:req.params.shorturl
      });
      if (result) {
          res.redirect(result.original_url)
      }
      else res.send({
        error: 'invalid short-url'
      })
      

    } catch(err) {
      res.send(err)
    }
  })



module.exports.handler=serverless(app)

// PROMISE CHAIN HELL
/*
function(req, res) {
  if (validator.isURL(req.body.url)) {
    mongoose.connect(process.env.MONGO_URI).then(
      ()=>{
        console.log('successful connection to DB');
        URLModel.findOne({original_url:req.body.url})
        .select('-_id original_url short_url')
        .exec()
          .then(
          result=>{
            if (result) {
              res.json(result)
            } else {
              console.log('start count')
              URLModel.countDocuments().then(count=>{
                console.log('count = ' + count)
                let URL=new URLModel({
                  original_url:req.body.url,
                  short_url:count+1
                })
                URL.save().then(result=>{console.log('saved');res.send(result)})
              })
            }
          }
        ).catch(err=>res.send(err))
          
    }).catch(err=>res.send(err))
    
  }
  else res.send({ error: 'invalid url' })
}
*/