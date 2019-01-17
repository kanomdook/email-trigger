const line = require('./line.js');
module.exports = function (req, res, detail) {
    run(req.body, res, detail);
}

async function run(params, res, detail) {
    try {
        const tokenRes = await line.getToken(params);
        var token = JSON.parse(tokenRes);
        console.log('========tokenRes======');
        console.log(token.status);
        console.log('=====================');
        if (token.status === 200) {
            console.log('********have token*******!');
            const lineRes = await line.sendNotification(token.access_token, detail);
            var lineJson = JSON.parse(lineRes);
            console.log('========lineRes======');
            console.log(lineJson);
            console.log('=====================');
            if (lineJson.status === 200) {
                res.json({
                    success: true,
                    msg: 'notification is sended!'
                });
            } else {
                res.json(lineRes);
            }
        } else {
            res.json({
                success: false,
                msg: 'no LINE token!'
            });
        }
    } catch (error) {
        throw error;
    }
}