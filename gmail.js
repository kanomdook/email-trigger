var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var request = require('request');
var currentPath = process.cwd();

// If modifying these scopes, delete your previously saved credentials
// at TOKEN_DIR/gmail-nodejs.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// Change token directory to your system preference
var TOKEN_DIR = (currentPath);
var TOKEN_PATH = TOKEN_DIR + '/access_token.json';
console.log('===========TOKEN_PATH============');
console.log(TOKEN_PATH);
console.log('=================================');

var gmail = google.gmail('v1');

// Load client secrets from a local file.
exports.run = function () {
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Gmail API.
        // fn. examplae => listLabels, getRecentEmail
        authorize(JSON.parse(content), getRecentEmail);
    });
};

exports.send = function (params) {
    console.log('===============params===========');
    console.log(params);
    console.log('================================');
    sendNoti('ทดสอบ get token');
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];

    var OAuth2 = google.auth.OAuth2;

    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    console.log('++++++++++++++++++++Token+++++++++++++');
    console.log(token);
    console.log('++++++++++++++++++++++++++++++++++++++');
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    gmail.users.labels.list({ auth: auth, userId: 'me', }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        var labels = response.data.labels;

        if (labels.length == 0) {
            console.log('No labels found.');
        } else {
            console.log('Labels:');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                console.log('%s', label.name);
            }
        }
    });
}

/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getRecentEmail(auth) {
    // Only get the recent email - 'maxResults' parameter
    gmail.users.messages.list({ auth: auth, userId: 'me', maxResults: 1, }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        // Get the message id which we will need to retreive tha actual message next.
        var message_id = response['data']['messages'][0]['id'];

        // Retreive the actual message using the message id
        gmail.users.messages.get({ auth: auth, userId: 'me', 'id': message_id }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            // Access the email body content, like this...
            message_raw = response['data']['payload']['parts'][0].body.data;

            // or like this
            message_raw = response.data.payload.parts[0].body.data;

            var data = message_raw;
            var buff = new Buffer(data, 'base64');
            var text = buff.toString();
            console.log(text);
            sendNoti(text);
            // console.log(response['data']);
        });
    });
}

function sendNoti(txt) {
    request({
        har: {
            url: 'https://notify-bot.line.me/oauth/token',
            method: 'POST',
            headers: [
                {
                    name: 'content-type',
                    value: 'application/x-www-form-urlencoded'
                }
            ],
            postData: {
                mimeType: 'application/x-www-form-urlencoded',
                params: [
                    {
                        name: 'grant_type',
                        value: 'authorization_code'
                    },
                    {
                        name: 'code',
                        value: '3U8NpblhnTPGJ62vl2OIFw'
                    },
                    {
                        name: 'redirect_uri',
                        value: 'https://line-notify-front.herokuapp.com/home'
                    },
                    {
                        name: 'client_id',
                        value: 'UxOzoFBdQrzhSghQdQTelG'
                    },
                    {
                        name: 'client_secret',
                        value: 'snij94Bv2deyxqGrv4sf91ZNgvbAv2woRdzFAFh9qUs'
                    }
                ]
            }
        }
    }, (err, httpResponse, body) => {
        if (err) {
            console.log('==============err============');
            console.log(err);
            console.log('============================');
        } else {
            console.log('==============body============');
            console.log(body);
            console.log('============================');
            let token = body.access_token ? body.access_token : '';
            lineNoti(token, txt);
        }
    });

    function lineNoti(token, message) {
        request({
            method: 'POST',
            uri: 'https://notify-api.line.me/api/notify',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                'bearer': token
            },
            form: {
                message: message
            }
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });
    }
}