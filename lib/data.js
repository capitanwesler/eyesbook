/*

    Library for handling data

*/

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');


// Instantiating the lib
let lib = {};

// Main directory for storing the data
lib.dirData = path.join(`${__dirname}/../.data/`);

// Creating the reading data - read
lib.read = (dir, fileName, callback) => {

    //We first start to reading the file
    fs.readFile(lib.dirData + dir + '/' + fileName + '.json', 'utf-8', (err, dataFile) => {
        if (!err && dataFile) {
            // parsing the JSON file
            let parsedData = helpers.parseJsonToObject(dataFile);
            callback(false, parsedData);
        }else {
            callback(err, false); //This is just a callback for error
        }
    });

};


// Creating the file data - create
lib.create = (dir, fileName, dataFile, callback) => {
    //console.log(dataFile);

    // We need to stringify the dataFile
    let stringData = JSON.stringify(dataFile);

    // console.log(stringData);

    //We need to know what is the directory
    fs.open(lib.dirData + dir + '/' + fileName + '.json', 'w', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //Now we are writting the file
            fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                    fs.close(fileDescriptor, err => {
                        if (!err) {
                            callback(false);
                        }else {
                            callback('Error closing this file');
                        }
                    });
                }else {
                    callback('Can \' write this file');
                }
            });
        }else {
            callback('Error opening the file');
        }
    });
};




// Exporting the library
module.exports = lib;