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
handlers.user = (data, callback) => {
    //Sanity-check
    let firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : undefined;
    let lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : undefined;
    let password = typeof(data.payload.password) === 'string' && data.payload.firstName.length > 8 ? data.payload.password : undefined;

    //@TODO: check if there is any user, if there is any user with this firstName and lastName
    //just callback an error
    if (firstName && lastName && password) {

        //Create a user object to save it into a JSON
        let userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'password': password,
        };

        _data.create('users', firstName.toLowerCase(), userObject, err => {
            if (!err) {
                callback(200);
            }else {
                callback(500);
            }
        });
    }else {
        callback(404);
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