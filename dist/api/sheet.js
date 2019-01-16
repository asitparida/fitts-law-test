"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var googleapis = require("googleapis");
var fs = require("fs");
function initialize(auth) {
    var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    var TOKEN_PATH = 'token.json';
    // Load client secrets from a local file.
    fs.readFile('credentials.json', function (err, content) {
        if (err) {
            return console.log('Error loading client secret file:', err);
        }
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), auth);
    });
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
        var oAuth2Client = new googleapis.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) { }
            return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
        var authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oAuth2Client.getToken(code, function (err, token) {
                if (err) {
                    return console.error('Error while trying to retrieve access token', err);
                }
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (errore) {
                    if (errore) {
                        console.error(errore);
                    }
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }
    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
}
exports.initialize = initialize;
function listObjects(auth) {
    var sheets = googleapis.google.sheets({ version: 'v4', auth: auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
        range: 'Sheet1!A1:K',
    }, function (err, res) {
        if (err) {
            return console.log('The API returned an error: ' + err);
        }
        var rows = res.data.values;
        if (rows.length) {
            console.log(rows[0]);
            // Print columns A and E, which correspond to indices 0 and 4.
            console.log(rows.length);
        }
        else {
            console.log('No data found.');
        }
    });
}
exports.listObjects = listObjects;
var googleAuth;
function SheetInit() {
    initialize(function (data) {
        googleAuth = data;
    });
}
exports.SheetInit = SheetInit;
function SheetGet() {
    console.log('SheetGet');
    listObjects(googleAuth);
}
exports.SheetGet = SheetGet;
// If modifying these scopes, delete token.json.
//# sourceMappingURL=sheet.js.map