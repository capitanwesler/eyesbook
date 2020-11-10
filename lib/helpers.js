/*
    Helpers for the app

*/

// Dependencies
const fs = require('fs');
const path = require('path');

// Instantiating the helpers object
let helpers = {};

// Base directory for the templates
helpers.baseDirTemplates = path.join(`${__dirname}/../templates/`);

// Base directory for the public files
helpers.baseDirPublic = path.join(`${__dirname}/../public/`);

// Read template
helpers.getTemplate = (templateName) => {
    // Sanity-check
    templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : 'index';

    return new Promise((resolve, reject) => {
        fs.readFile(helpers.baseDirTemplates + templateName + '.html', 'utf-8', (err, dataFile) => {
            if (!err && dataFile) {
                // We send the data
                let sendData = {
                    'dataFile': dataFile,
                    'statusCode': 200,
                    'contentType': 'html',
                };
                resolve(sendData);
            }else {
                reject(err);
            }
        });
    });
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
    
    //Sanity-check for the fileName
    fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false;

    if (fileName) {
        fs.readFile(helpers.baseDirPublic + fileName, (err, fileData) => {
            if (!err && fileData) {
                callback(false, fileData);
            }else {
                callback('Error reading this file.');
            }
        });
    }else {
        callback('A valid file name was not specified');
    }
    
};

//@TODO: create a helper to hash the password

//Parse the JSON string to a object in all cases without throwing
helpers.parseJsonToObject = (str) => {
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e) {
        return {};
    }
};

// Exporting the helpers
module.exports = helpers;