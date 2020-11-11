/*
    Main file for the handlers of the server
*/

// Dependencies
const helpers = require('./helpers');
const _data = require('./data');


// Instantiate the handlers object
let handlers = {};

// Handler - template
handlers.template = (data, callback) => {
    helpers.getTemplate(data.trimmedPath)
        .then(sendData => {
            callback(sendData.statusCode, sendData.dataFile, sendData.contentType);
        })
        .catch(err => {
            console.log(err);
        });
};

// Handler - public
handlers.public = (data, callback) => {
    
    //Reject any request that is not GET
    if (data.method === 'get') {
        // Get the fileName based on the trimmedPath
        let trimmedAssetName = data.trimmedPath.replace('public/', '');

        if (trimmedAssetName.length > 0) {

            //Read the public asset data
            helpers.getStaticAsset(trimmedAssetName, (err, dataFile) => {
                if (!err && dataFile) {
                    // Determine the content type (default to plain text)
                    let contentType = 'plain';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    callback(200, dataFile, contentType);
                }else {
                    callback(404); // This means that the file is not found
                }
            });
        }
    }else {
        callback(404);
    }
};

// Handlers API
// Handler user

handlers.user = (data, callback) => {
    //Choose the right handler from users
    // to the different http method's 
    let method = ['GET', 'POST', 'PUT', 'DELETE'].indexOf(data.method.toUpperCase()) > -1 ? data.method : false;

    //If there is a acceptable method, then we can go with the handler for that method in users
    if (method) {
        //Then we call that handler
        handlers._users[method](data, callback);
    }else {
        callback(405);
    }
};

//Container for the users submethods
handlers._users = {};

// Handler _user - post
handlers._users.post = (data, callback) => {
    //Sanity-check
    let email = typeof(data.payload.email) === 'string' && data.payload.email.length > 0 ? data.payload.email : undefined;
    let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : undefined;
    let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : undefined;
    let password = typeof(data.payload.password) === 'string' && data.payload.password.length > 8 ? data.payload.password : undefined;

    if (firstName && lastName && password && email) {

        // Check if there is any user, if there is any user with this email,
        //  then just callback an error
        _data.read('users', email, (err, dataFile) => {
            if (err && !dataFile) {
                //Create a user object to save it into a JSON
                let userObject = {
                    'email': email,
                    'firstName': firstName,
                    'lastName': lastName,
                    'password': password, //@TODO: try to hash the password
                };

                //Now we create the user in the .data folder
                _data.create('users', email, userObject, err => {
                    if (!err) {
                        callback(200);
                    }else {
                        callback(500);
                    }
                });
            }else {
                callback(403, {'Error': 'there is already one'});
            }
        });
    }else {
        callback(403);
    }
    
};

//Handler _user - get
handlers._users.get = (data, callback) => {
    
    //Sanity-check
    let email = typeof(data.queryObject.email) === 'string' && data.queryObject.email.length > 0 ? data.queryObject.email : undefined;
    let password = typeof(data.queryObject.password) === 'string' && data.queryObject.password.length > 0 ? data.queryObject.password : undefined;

    //Now we need to check if there is any file with that email
    if (email && password) {
        console.log(email, password);
        //If there is any file with that fileName
        _data.read('users', email, (err, dataFile) => {
            //If there is no error, and there is dataFile
            if (!err && dataFile) {
                
                //We only callback the information, if the password, that the user sends
                // with the request match with the saved password
                if (password === dataFile.password) {
                    callback(200, dataFile);
                }else {
                    callback(403, {'Error': 'you are not this guy'});
                }
            }else {
                callback(404);
            }
        });
    }else {
        callback(403);
    }
};


// Handler - notFound
handlers.notFound = (data, callback) => {
    helpers.getTemplate('notfound')
        .then(sendData => {
            callback(404, sendData.dataFile, sendData.contentType);
        })
        .catch(err => {
            console.log(err);
        });
};

// Exporting the handlers
module.exports = handlers;