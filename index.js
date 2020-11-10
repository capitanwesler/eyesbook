/*
*
*  Primary file for the API
*
*/

//Dependencies
var server = require('./lib/server');

// Declare the app
var app = {};

//Init function
app.init = () => {
    //Start the server
    server.init();
};

// Execute the app init 
app.init();

//Export the app
module.exports = app;