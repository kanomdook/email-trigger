'use strict'
var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var currentPath = process.cwd();

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (currentPath);
var TOKEN_PATH = TOKEN_DIR + '/access_token.json';
console.log('===========TOKEN_PATH============');
console.log(TOKEN_PATH);
console.log('=================================');

var gmail = google.gmail('v1');

module.exports = function () {
    let res = run();
    console.log(res);
}

async function run() {
    fs.readFile('client_secret.json', async function processClientSecrets(err, content) {
        if (err) {
            console.log(err);
        } else {
            try {
                const authRes = await gmailAuth(JSON.parse(content));
                if (authRes) {
                    const emailRes = await getLastEmail(authRes);
                    if (emailRes) {
                        return emailRes;
                    } else {
                        console.log('can not get last email form gmail');
                    }
                } else {
                    console.log('gmail not Auth!');
                }
            } catch (error) {
                throw error;
            }
        }
    });
};


function gmailAuth(credentials) {
    return new Promise((resove, reject) => {
        var clientSecret = credentials.web.client_secret;
        var clientId = credentials.web.client_id;
        var redirectUrl = credentials.web.redirect_uris[0];
        var OAuth2 = google.auth.OAuth2;
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                reject(err);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                resove(oauth2Client);
            }
        });
    });
}

function getLastEmail(auth) {
    return new Promise((resove, reject) => {
        gmail.users.messages.list({ auth: auth, userId: 'me', maxResults: 1, }, function (err, response) {
            if (err) {
                reject(err);
            }
            if (response) {
                var message_id = response['data']['messages'][0]['id'];
                gmail.users.messages.get({ auth: auth, userId: 'me', 'id': message_id }, function (err, response) {
                    if (err) {
                        reject(err);
                    }
                    if (response) {
                        var message_raw = response.data.payload.parts[0].body.data;
                        var data = message_raw;
                        var buff = new Buffer(data, 'base64');
                        var text = buff.toString();
                        resove(text);
                    }
                });
            }
        });
    });
}