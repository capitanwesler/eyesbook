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
    xhr.setRequestHeader('Content-type', 'application/json');

    // For each header sent, add it to the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
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
                    callback(statusCode, parsedResponse);
                } catch(e){
                    callback(statusCode, false);
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
    let singUpForm = document.querySelector('#singUpForm');

    // Adding the event listener
    singUpForm.addEventListener('submit', app.singUp);
};

// Doing the singUp logic for the form

app.singUp = function(e) {
    //We prevent the form from submiting
    e.preventDefault();

    let elements = this.elements; // this is to getting all the elements on the form

    //Now i'm going to iterate over each element in the form
    // and format my payload to send the request
    let newPayload = {};

    // This is for saving the confirmPassword to a variable
    let confirmPassword = '';

    for (element of elements) {
        if (element.name === 'firstName' || element.name === 'lastName' || element.name === 'password'
            || element.name === 'email') {
            newPayload[element.name] = element.value;
        }

        if (element.name === 'confirmPassword') {
            confirmPassword = element.value;
        }
    }

    //Just checking
    console.log(newPayload);

    // If the two password's match, then we do the request, else
    // we show the error
    if (newPayload.password === confirmPassword) {

        //We need to check if the errorDiv have or no the non-displayed class
        if (!document.querySelector('.error-handling').classList.contains('non-displayed')) {
            document.querySelector('.error-handling').classList.add('non-displayed');
        }


        //Making the request with the interface
        app.client.request(undefined, this.action, this.method.toUpperCase(), undefined, newPayload, (statusCode, payloadResponse) => {
            //Just to check if the response is all good
            console.log(statusCode, payloadResponse);
        });

        // After we send the request, we redirect to main page
        // @TODO: create a token, if the user try to singUp again,
        // we need to check if the user is already loggedIn
        window.location.href = "/";
    }else {
        // We need to grab the div with the class .error-handling
        let errorDiv = document.querySelector('.error-handling');

        //Next remove the non-displayed class
        errorDiv.classList.remove('non-displayed');

        //Now in the span with the id #password-equal
        //we need to display it
        errorDiv.querySelector('#password-equal').classList.remove('non-displayed');

    }
};


//Init the app client-side
app.init = function() {
    
    //Bind the singUp form
    app.bindSingUp();
};

window.onload = function() {
    app.init(); // Starting the app in the window load application
};

