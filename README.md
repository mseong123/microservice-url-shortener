# URL Shortener Microservice

This service accepts a VALID URL and will return both the original URL and the shortened URL in a JSON response. User can pass the shortened URL to the API and it will redirect the user to the original URL website. Service will return a JSON error if user pass an invalid URL (either invalid website name or invalid protocol ie HTTP/HTTPs/ftp).

* Built using NodeJS, ExpressJS.
* Database - MongooseJS and MongoDB.
* Async/await ES6 Javascript functions used in interaction with Database. 
* Hosted on Netlify and server-side API is built using Netlify's serverless AWS Lambda Functions. 
