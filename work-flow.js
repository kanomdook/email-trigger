const line = require('./line.js');
module.exports = function (req, res, detail) {
    run(req.body, res, detail);
}

async function run(params, res, detail) {
    try {
        const tokenRes = await line.getToken(params);
        console.log('========tokenRes======');
        console.log(tokenRes);
        console.log('=====================');
        if (tokenRes) {
            console.log('********have token*******!');
            const lineRes = await line.sendNotification(tokenRes.access_token, detail);
            console.log('========lineRes======');
            console.log(lineRes);
            console.log('=====================');
            if (lineRes.status == 200) {
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