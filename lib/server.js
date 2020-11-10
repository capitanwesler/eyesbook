/*

    Main file for the Server

*/

// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helpers = require('./helpers');


// Instantiate the server module object

let server = {};

// Instantiate the http server
server.httpServer = http.createServer((request, response) => {
    // First we need to parse the URL
    let parsedUrl = url.parse(request.url, true);

    // We get the path
    let path = parsedUrl.pathname; // to get the path, what the user is requesting
    let trimmedPath = path.replace(/^\/+|\/+$/g, ''); //The trimmedPath just replace the slash "/" for a empty space

    // We get the queryObject
    let queryObject = parsedUrl.query;

    //Get the HTTP method
    let method = request.method.toLowerCase();

    //Get the headers as an object
    let headers = request.headers;

    // Get the payload, if there is any payload
    let decoder = new stringDecoder('utf-8'); // to decode the string in UTF-8
    let buffer = '';

    //The request object is expecting the data, then im writting that with the decoder.write, 
    //and the request is listening for the event data
    request.on('data', (data) => {
        buffer += decoder.write(data);
    });

    //when the request is finished, we listen for the event 'end'
    //and then send the response and console.log
    request.on('end', () => {
        buffer += decoder.end();

        //Choose the handler for this request. If one is not found, use the notFound handler
        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory, use the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        //Constructs the data object
        let data = {
            'trimmedPath': trimmedPath,
            'queryObject': queryObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data, (statusCode, payload, contentType) => {
            //Sanity-check
            //If there is no status code, he fallback to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
        
            //If there is no contentType, fallback to json
            contentType = typeof(contentType) === 'string' && contentType.length > 0 ? contentType : 'json';


            //string payload
            let payloadString = '';

            if (contentType === 'json') {
                response.setHeader('Content-Type', '/application/json');
                payload = typeof(payload) === 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }

            if (contentType === 'html') {
                response.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) === 'string' ? payload : '';
            }

            if (contentType === 'favicon') {
                response.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'css') {
                response.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'png') {
                response.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'jpg') {
                response.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if (contentType === 'plain') {
                response.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            response.writeHead(statusCode);
            response.end(payloadString);
        });
        
    });
    
});

// Here we'll write all the routes of the application
server.router = {
    '': handlers.template,
    'singup': handlers.template,
    'api/user': handlers.user,
    'public': handlers.public
};

// Init the script
server.init = () => {
    server.httpServer.listen(3000, () => {
        console.log('Starting the server at: http://localhost:3000');
    });
};

// Export the server module
module.exports = server;