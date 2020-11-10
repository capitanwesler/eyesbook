/*

    This is the JavaScript file for the
    client-side front-end logic application
*/

// Container for frontend application
let app = {};

// AJAX Client for the REST api
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback){
    // Set defaults
    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' ? path : '/';
    method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    var requestUrl = path + '?';
    var counter = 0;

    for(var queryKey in queryStringObject){
        if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if(counter > 1){
            requestUrl+='&';
            }
            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // For each header sent, add it to the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if(app.config.sessionToken){
        xhr.setRequestHeader("token", app.config.sessionToken.id);
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE) {
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            // Callback if requested
            if(callback){
            try{
                var parsedResponse = JSON.parse(responseReturned);
                callback(statusCode,parsedResponse);
            } catch(e){
                callback(statusCode,false);
            }

            }
        }
    }

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);

};

// Bind the singUp form

app.bindSingUp = function() {
    
    //We start to selectin the form with for the signUp
    let singUpForm = document.querySelector("#singUp");

    console.log(singUpForm);
};


//Init the app client-side
app.init = function() {
    
    //Bind the singUp form
    app.bindSingUp();
};

window.onload = function() {
    app.init(); // Starting the app in the window load application
};
