const line = require('./line.js');
module.exports = function (req, res) {
    run(req.body, res);
}

async function run(params, res) {
    try {
        const token = await line.getToken(params);
        if (token) {
            const lineRes = await line.sendNotification(token, 'ทดสอบ Line Notification');
            if (lineRes.status === 200) {
                res.json({
                    success: true
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