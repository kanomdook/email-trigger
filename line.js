const request = require('request');

exports.getToken = function (params) {
    return new Promise((resove, reject) => {
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
                            value: params ? params.code : ''
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
                reject(err);
            } else {
                console.log('======body======');
                console.log(body);
                console.log('==================');
                let token = body.access_token ? body.access_token : '';
                resove(token);
            }
        });
    });
};

exports.sendNotification = function (token, message) {
    return new Promise((resove, reject) => {
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
                reject(err);
            } else {
                resove(body);
            }
        });
    });
};