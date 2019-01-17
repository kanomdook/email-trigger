const line = require('./line.js');
module.exports = function (req, res) {
    console.log('========req==========');
    console.log(req.body);
    console.log('=====================');
    run(req.body, res);
}

async function run(params, res) {
    try {
        const tokenRes = await line.getToken(params);
        if (tokenRes.status === 200) {
            const lineRes = await line.sendNotification(tokenRes.access_token, 'ทดสอบ Line Notification');
            console.log('========lineRes======');
            console.log(lineRes);
            console.log('=====================');
            if (lineRes.status === 200) {
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